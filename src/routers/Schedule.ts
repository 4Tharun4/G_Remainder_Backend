import puppeteer from 'puppeteer';
import { getdata, updateUserData } from '../db/data'; // Import necessary database functions
import verifyToken from '../helpers/VerifyPasswordToken';

const updateUserInfo = async () => {
  try {
    const users = await getdata();
    for (const user of users) {
      const { userid, password } = user;
     // console.log(`Processing user: ${userid}`);
      
      const verifypassword = verifyToken(password);
     // console.log(`Verified password: ${verifypassword}`);

      if (!verifypassword) {
       // console.log(`Invalid token for user: ${userid}`);
        continue;
      }

      // Use puppeteer to scrape new data for each user
      const { courses, assignments } = await scrapeTasks(userid, verifypassword);

    //   console.log(`Courses: ${JSON.stringify(courses, null, 2)}`);
    //   console.log(`Assignments: ${JSON.stringify(assignments, null, 2)}`);
      
      // Update user data
      const updated = await updateUserData(userid, {
        Assiggnments: assignments,
        Courses: courses
      });
      
     // console.log(`Update result for user ${userid}: ${JSON.stringify(updated, null, 2)}`);
    
    }

   // console.log('User data updated successfully.');
    
  } catch (error) {
    console.error('Error updating user data:', error);
  }

};

const scrapeTasks = async (userid: string, password: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://login.gitam.edu/Login.aspx', { waitUntil: 'load',timeout:600000 });

  // Enter login credentials
  await page.type('input[name=txtusername]', userid);
  await page.type('input[name=password]', password);

  // Extract the captcha text and calculate the sum
  const captchaText = await page.evaluate(() => {
    return (document.querySelector('#captcha .preview') as HTMLElement).innerText;
  });

  const [num1, num2] = captchaText.match(/\d+/g).map(Number);
  const solution = num1 + num2;

  // Enter the captcha solution
  await page.type('#captcha_form', solution.toString());

  // Submit the login form
  await Promise.all([
    page.click('#Submit'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  const loginError = await page.evaluate(() => {
    const errorElement = document.querySelector('#lblmessage');
    return errorElement ? errorElement.textContent.includes('Invalid User ID / Password') : false;
  });

  if (loginError) {
   // console.log('Invalid Credentials');
    await browser.close();
    throw new Error('Invalid User ID / Password. Please try again.');
  }

  const courseLinkSelector = 'a.course[href*="glearn.gitam.edu"]'; 
  await page.waitForSelector(courseLinkSelector, { timeout: 5000 });
  const courseUrl = await page.$eval(courseLinkSelector, el => el.href);
  

  // Navigate directly to the extracted URL
  await page.goto(courseUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for assignments section to load
  await page.waitForSelector('#ullist_today_cld li', { timeout: 10000 }).catch(() => console.log('Assignments not found'));
  
  // Extract assignments
  const assignments = await page.evaluate(() => {
    const assignmentElements = document.querySelectorAll('#ullist_today_cld li');
    const assignmentsData:any = [];

    assignmentElements.forEach((el) => {
        const eventDay = el.querySelector('.eventDay')?.textContent.trim();
        const eventYear = el.querySelector('.eventYear')?.textContent.trim();
        const assignmentDate = `${eventDay} ${eventYear}`;
        const assignmentTitle = el.querySelector('.assignTitle')?.textContent.trim();
        const subjectCode = el.querySelector('.eventName span:nth-child(2)')?.textContent.trim();

      

        assignmentsData.push({
            assignmentTitle,
            subjectCode,
            assignmentDate,
        });
    });

    return assignmentsData;
});

  // Wait for courses section to load
  await page.waitForSelector('.row#coursesGridView .col-sm-6', { timeout: 10000 }).catch(() => console.log('Courses not found'));
  
  // Fetch courses
  const courses = await page.evaluate(() => {
    const courseElements = Array.from(document.querySelectorAll('.row#coursesGridView .col-sm-6'));
    return courseElements.map((el, index) => {
        const courseNameElement = el.querySelector(`#subbox${index + 1} #sub_name`);
        const courseCodeElement = el.querySelector(`#subbox${index + 1} .courseCode`);
        const courseCompletionElement = el.querySelector(`#subbox${index + 1} .secDetails span:first-child`);
        const semesterElement = el.querySelector(`#subbox${index + 1} .secDetails span:last-child`);

        const courseName = courseNameElement ? courseNameElement.textContent.trim() : 'N/A';
        const courseCode = courseCodeElement ? courseCodeElement.textContent.trim() : 'N/A';
        const courseCompletion = courseCompletionElement ? courseCompletionElement.textContent.trim().replace('Course completion :', '') : 'N/A';
        const semester = semesterElement ? semesterElement.textContent.trim().replace('Semester :', '') : 'N/A';

        return {
            courseName,
            courseCode,
            courseCompletion,
            semester
        };
    });
});

  await browser.close();
  return { courses, assignments };
};

// Schedule the job to run every minute for testing
// cron.schedule('* * * * *', () => {
//   console.log('Running scheduled job to update user data');
//   updateUserInfo();
// });

export default updateUserInfo;

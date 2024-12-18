"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const passwordtokengenerater_1 = __importDefault(require("../helpers/passwordtokengenerater"));
const data_1 = require("../db/data");
const register = async (req, res) => {
    try {
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(404).json({ message: "Userid and password Required" });
        }
        //if user already exists in mydatabse then just send send data to user
        const existinguser = await (0, data_1.getdatabyuserid)(userid);
        if (existinguser) {
            await existinguser.save();
            return res.status(200).json({ Message: "Already Present in database sending data from database", existinguser }).end();
        }
        const browser = await puppeteer_1.default.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://login.gitam.edu/Login.aspx', { waitUntil: "load", timeout: 600000 });
        // Enter login credentials
        await page.type('input[name=txtusername]', userid);
        await page.type('input[name=password]', password);
        // Extract the captcha text and calculate the sum
        const captchaText = await page.evaluate(() => {
            //@ts-ignore
            return document.querySelector('#captcha .preview').innerText;
        });
        const [num1, num2] = captchaText.match(/\d+/g).map(Number);
        const solution = num1 + num2;
        // Enter the captcha solution
        await page.type('#captcha_form', solution.toString());
        // Submit the login form
        await Promise.all([
            await page.click('#Submit'),
            await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => { }),
        ]);
        const loginError = await page.evaluate(() => {
            const errorElement = document.querySelector('#lblmessage');
            return errorElement ? errorElement.textContent.includes('Invalid User ID / Password') : false;
        });
        if (loginError) {
            //console.log("Invalid Creditionals");
            await browser.close();
            return res.status(401).json({ success: false, message: 'Invalid User ID / Password. Please try again.' });
        }
        const username = await page.evaluate(() => {
            // Adjust this selector to match the element where the username is displayed
            const usernameElement = document.querySelector('.userName');
            return usernameElement ? usernameElement.textContent.trim() : 'Unknown';
        });
        //assignments
        const courseLinkSelector = 'a.course[href*="glearn.gitam.edu"]';
        await page.waitForSelector(courseLinkSelector, { timeout: 5000 });
        const courseUrl = await page.$eval(courseLinkSelector, el => el.href);
        // Navigate directly to the extracted URL
        await page.goto(courseUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        // Extract assignments
        const assignments = await page.evaluate(() => {
            const assignmentElements = document.querySelectorAll('#ullist_today_cld li');
            const assignmentsData = [];
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
        // courses featching
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
        //quizes 
        //Password Hashing
        const hashpasswordtoken = (0, passwordtokengenerater_1.default)(password);
        const user = (0, data_1.crateuser)({
            username, userid, password: hashpasswordtoken, Assiggnments: assignments, Courses: courses
        });
        await browser.close();
        return res.status(200).json({ success: true, user, assignments, courses });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.register = register;
//# sourceMappingURL=authentication.js.map
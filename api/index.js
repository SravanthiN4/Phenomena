// Build an apiRouter using express Router
const { create } = require('combined-stream');
const express = require('express');
const apiRouter = express.Router();
// const reportsRouter = express.Router();

// Import the database adapter functions from the db

const {
    getOpenReports,
    closeReport,
    createReportComment,
    createReport} = require('../db')
/**
 * Set up a GET request for /reports
 * 
 * - it should use an async function
 * - it should await a call to getOpenReports
 * - on success, it should send back an object like { reports: theReports }
 * - on caught error, call next(error)
 */

// apiRouter.use((req,res,next) => {
//     console.log("A request has been made for ./reports");
//     next();
// })

 apiRouter.get('/reports',async(req,res,next) => {
    //console.log("Are we getting in here?..")
    try {

        const openReports = await getOpenReports();
        console.log(openReports);
        res.send({
           reports : openReports
        })
        
    } catch ({name,message}) {
        next({name,message});
    }
})

/**
 * Set up a POST request for /reports
 * 
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */

 apiRouter.post('/reports',async(req,res,next)=> {

    const {title, location, description,password} = req.body;
    const reportData = {};

    try {
        reportData.title = title
        reportData.location = location
        reportData.description = description
        reportData.password = password
       
        if(reportData.length !== 0) {
            const createNewReport = await createReport(reportData);
            res.send(createNewReport)
        } else {
            next({
                name: 'ReportNotCreated', 
                message: 'Report is not created'
            })
        }
        
    } catch ({ name, message }) {
        next({ name, message });
      }
})


/**
 * Set up a DELETE request for /reports/:reportId
 * 
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */

apiRouter.delete('/reports/:reportId',async(req,res,next) => {
    try {
        const deletedReport = await closeReport(req.params.reportId, req.body.password);
        console.log(deletedReport);
        
        // next(deletedReport?{
        //     name: "do Nothing", 
        //     message: "do Nothing"
        // }: {
        //     name: "ReportNotFound",
        //     message: "That report doesnt exist"
        //     })

            res.send(deletedReport);
    } catch ({ name, message }) {
        next({ name, message })
      }
})

/**
 * Set up a POST request for /reports/:reportId/comments
 * 
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */
apiRouter.post('/reports/:reportId/comments', async(req,res,next) => {
    
    const {reportId} = req.params;
    const commentData = {};

    try {
        commentData.reportId = reportId;
        console.log("commentdata",commentData);
        const createNewComment = await createReportComment(reportId,req.body)
        console.log("createNew",createNewComment);
        res.send(createNewComment);
        
        
    } catch ({ name, message }) {
        next({ name, message });
      }
})


// Export the apiRouter
module.exports = apiRouter;

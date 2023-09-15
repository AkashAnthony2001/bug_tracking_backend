const issueStatus = require('../models/issuestatus.model')
const issuetracker = require('../models/issuetracker.model')
const projects = require('../models/projects.model')
const modules = require('../models/module.model')
const { formatRoute } = require('../utils/helpers')


const getBugs = async (req, res) => {
    try {
        const issuesData = await issuetracker.find().populate('projectId').populate('moduleId').populate({ path: 'assignedTo', select: 'username' }).populate({ path: 'reportedBy', select: 'username' }).populate({ path: 'createdby', select: 'username' }).exec()
        res.send(issuesData)
    } catch (error) {
        res.send(error)
    }
}

const getBugsBySprint = async (req, res) => {
    try {
        const dataBySprint = await issuetracker.find({}).populate({ path: 'assignedTo', select: 'username' }).select('sprint status')      
        
        if (dataBySprint) {
            const sprintStatusCounts = {};
            const userSprints = {};
            for (let i = 1; i <= 10; i++) {
                sprintStatusCounts[`sprint${i}`] = {
                  InProgress: 0,
                  Opened:0,
                  Closed:0,
                  Assigned:0,
                  Resolved:0,
                  Testing:0,
                  Verified:0,
                  Hold:0,
                };
              }
          
              dataBySprint.forEach(item => {
                const { sprint, status } = item;
                sprintStatusCounts[`sprint${sprint}`][status]++;
              });
            dataBySprint.forEach(item => {
                const { assignedTo: { username }, sprint } = item;
                if (!userSprints[username]) {
                    userSprints[username] = { user: username, totalCount: 0 };
                    for (let i = 1; i <= 10; i++) {
                        userSprints[username][`sprint${i}`] = 0;
                    }
                }
                userSprints[username][`sprint${sprint}`] = userSprints[username][`sprint${sprint}`] + 1;
                userSprints[username].totalCount++;
            });
            const dataset = Object.values(userSprints);
            console.log(sprintStatusCounts,dataset);
            res.status(200).json({ message: "Success", error: false, response: dataset, sprintCount:sprintStatusCounts, status: 200 })
        }
        else {
            res.status(404).json({ message: "Error", error: true, response: [], status: 404 })
        }
    } catch (error) {
        res.send(error)

    }
}

const getUsersSprintData = async (req, res) => {

    try {
        const sprintData = await issuetracker.find({}).populate({ path: 'assignedTo', select: 'username' }).select('sprint')

        const dataBySprint = {};
        sprintData.forEach(item => {
            const username = item.assignedTo.username;
            const sprint = `sprint${item.sprint}`;
            if (!dataBySprint[username]) {
                dataBySprint[username] = {};
            }
            if (!dataBySprint[username][sprint]) {
                dataBySprint[username][sprint] = 0;
            }
            dataBySprint[username][sprint]++;
        });
        const sprints = [];
        for (let i = 1; i <= 10; i++) {
            sprints.push({
                bugs: 0,
                sprint: `sprint${i}`,
            });
        }
        const data = Object.keys(dataBySprint).map(username => {
            return {
                username: username,
                sprints: sprints.map(sprint => {
                    return {
                        bugs: dataBySprint[username][sprint.sprint] || 0,
                        sprint: sprint.sprint,
                    };
                }),
            };
        });

        res.status(200).json({error:false, response:data, message:'Success', status:200});
    } catch (error) {
        console.error('Error:', error);
        res.status(404).json({ message: 'Error', error: true, response: [], status: 404 });
    }

}


const barAssignClosed = async(req, res) => {
    try {
        const statusData = await issuetracker.find().populate({ path: 'assignedTo', select: 'username' }).select('status')
    
        const statusCount = {}
    
        statusData.forEach(item => {
            const username = item.assignedTo.username
            const status = item.status
    
            if (!statusCount[username]) {
                statusCount[username] = { username: username, Assigned: 0, Closed: 0 }
            }
    
            if (status === "Assigned") {
                statusCount[username].Assigned++;
            } else if (status === "Closed") {
                statusCount[username].Closed++;
            }
        });
    
        const statusCountData = Object.values(statusCount);
    
        res.status(200).json({status:200, message:"Success", error:false, response:statusCountData});
    } catch (error) {
        res.status(404).json({ message: 'Error', error: true, response: [], status: 404 });
    }
    
}

const assignedTo = async (req, res) => {
    const username = req.params.username;
    try {
        const issuesData = await issuetracker
            .find()
            .populate('projectId')
            .populate('moduleId')
            .populate({
                path: 'assignedTo',
                select: 'username'
            })
            .populate('reportedBy')
            .populate('status')
            .exec();


        const userIssues = issuesData.filter(issue => issue.assignedTo.username === username);

        if (userIssues.length > 0) {
            res.send(userIssues);
        } else {
            res.send({ message: 'No Projects Assigned To You !' });
        }

    } catch (error) {
        res.send(error);
    }
}

const reportedBy = async (req, res) => {
    const username = req.params.username;
    try {
        const issuesData = await issuetracker
            .find()
            .populate('projectId')
            .populate('moduleId')
            .populate('assignedTo')
            .populate({
                path: 'reportedBy',
                select: 'username'
            })
            .populate('status')
            .populate({ path: 'createdby', select: 'username' })
            .exec();


        const userIssues = issuesData.filter(issue => issue.reportedBy.username === username);

        if (userIssues.length > 0) {
            res.send(userIssues);
        } else {
            res.send({ message: 'No Projects Have Been Reported By You !' });
        }

    } catch (error) {
        res.send(error);
    }
}


const createBugs = async (req, res) => {
    try {
        const { bug_description, bug_id, projectId, bug_type, moduleId, status, assignedTo, reportedBy, severity, sprint, customerfound, estimate_date, createdby, createddate } = req.body
        const data = new issuetracker({
            bug_id: bug_id,
            bug_description: bug_description,
            bug_type: bug_type,
            severity: severity,
            projectId: projectId,
            moduleId: moduleId,
            status: status,
            assignedTo: assignedTo,
            reportedBy: reportedBy,
            sprint: sprint,
            customerfound: customerfound,
            estimate_date: estimate_date,
            createdby: createdby
        })
        const datas = await data.save()
        const issueStatusData = new issueStatus({
            bug_id: bug_id,
            status: status,
            updatedby: createdby
        })
        const issueData = await issueStatusData.save()
        res.send({ datas, issueData })
    } catch (error) {
        res.send(error)
    }
}

const generateBugId = async (req, res) => {
    const { projectid, moduleid } = req.body;
    try {
        const countDoc = await issuetracker.countDocuments();
        const nextBugId = `${(countDoc + 1).toString().padStart(5, '0')}`;
        const projectData = await projects.findById(projectid);
        const moduleData = await modules.findById(moduleid);

        const bugId = `${formatRoute(projectData.title)}-${formatRoute(moduleData.module_name)}-${nextBugId}`;
        res.status(200).json({ status: 200, message: "Bug Id Created", response: bugId, error: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the bug ID' });
    }
};
const updateBugs = async (req, res) => {
    try {
        const id = req.body._id
        const { status, updatedby } = req.body
        const dataToUpdate = {
            status: status,
        }
        const updatedData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        const issueStatusData = new issueStatus({
            bug_id: updatedData.bug_id,
            status: updatedData.status,
            updatedby: updatedby,
        })
        await issueStatusData.save()
        res.status(201).json({ status: "success", error: false, message: "Status Updated" })
    } catch (error) {
        res.send(error)
    }
}

const deleteBugs = async (req, res) => {
    try {
        const id = req.params.id
        const assigned = await issuetracker.findById(id).populate('assignedTo').exec()
        if (assigned.assignedTo.length > 0 && assigned.status === "Closed") {
            const deletingBugs = await issuetracker.findByIdAndDelete(id)
            res.status(200).json({ status: 200, message: "Bug Deleted ", error: false })
        }
        else {
            res.status(405).json({ status: 405, message: "Cannot delete bugs assigned to user", error: false })
        }
        res.send(assigned)
    } catch (error) {
        res.send(error)
    }
}



module.exports = { getBugs, createBugs, updateBugs, deleteBugs, assignedTo, reportedBy, generateBugId, getBugsBySprint, getUsersSprintData , barAssignClosed }

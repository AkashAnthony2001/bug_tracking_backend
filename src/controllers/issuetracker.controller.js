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
                    Opened: 0,
                    Closed: 0,
                    Assigned: 0,
                    Resolved: 0,
                    Testing: 0,
                    Verified: 0,
                    Hold: 0,
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
            const statusCount = Object.entries(sprintStatusCounts)
            res.status(200).json({ message: "Success", error: false, response: dataset, sprintCount: statusCount, status: 200 })
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

        res.status(200).json({ error: false, response: data, message: 'Success', status: 200 });
    } catch (error) {
        console.error('Error:', error);
        res.status(404).json({ message: 'Error', error: true, response: [], status: 404 });
    }

}


const barAssignClosed = async (req, res) => {
    try {
        const statusData = await issuetracker.find().populate({ path: 'assignedTo', select: 'username' }).select('status')

        const statusCount = {}

        statusData.forEach(item => {
            const username = item.assignedTo.username
            const status = item.status

            if (!statusCount[username]) {
                statusCount[username] = { username: username, Assigned: 0, Closed: 0, InProgress: 0 }
            }

            if (status === "Assigned") {
                statusCount[username].Assigned++;
            } else if (status === "Closed") {
                statusCount[username].Closed++;
            } else if(status === "InProgress"){
                statusCount[username].InProgress++;

            }
        });

        const statusCountData = Object.values(statusCount);

        res.status(200).json({ status: 200, message: "Success", error: false, response: statusCountData });
    } catch (error) {
        res.status(404).json({ message: 'Error', error: true, response: [], status: 404 });
    }

}

const assignedToMe = async (req, res) => {
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

const reportedByMe = async (req, res) => {
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
            updatedby: createdby,
            comments: "N/A"
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
        const id = req.params.id
        console.log(req.body);
        const { status, updatedby, sprint, comment } = req.body
        const dataToUpdate = {
            status: status,
            sprint: sprint
        }
        const updatedData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        console.log(updatedData);
        const issueStatusData = new issueStatus({
            bug_id: updatedData.bug_id,
            status: updatedData.status,
            updatedby: updatedby,
            comments: req.body.comment
        })
        console.log(issueStatusData);
        await issueStatusData.save()
        res.status(201).json({ status: "success", error: false, message: "Status Updated" })
    } catch (error) {
        res.send(error)
    }
}

const updateSprint = async (req, res) => {
    try {
        const id = req.params.id
        const { sprint } = req.body
        const dataToUpdate = {
            sprint: sprint
        }
        const updatedData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        res.status(201).json({ status: "success", response: updatedData, error: false, message: "Status Updated" })
    } catch (error) {
        res.send(error)
    }
}

const updateAllBugs = async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    try {
        const {bug_id, bug_description, severity, status, sprint, customerfound, estimate_date, createdby, bug_type, projectId, moduleId, assignedTo, reportedBy} = req.body
        const dataToUpdate = {
            bug_id: bug_id,
            bug_description: bug_description,
            bug_type: bug_type,
            severity: severity,
            projectId: projectId._id,
            moduleId: moduleId._id,
            status: status,
            assignedTo: assignedTo._id,
            reportedBy: reportedBy._id,
            sprint: sprint,
            customerfound: customerfound,
            estimate_date: estimate_date,
            createdby: createdby
        }
        const updateAllData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        console.log(updateAllData);
        res.status(201).json({ status: "success", response: updateAllData, error: false, message: "Bugs Updated" })
    } catch (error) {
        res.send(error.message)
    }
}

const deleteBugs = async (req, res) => {
    try {
        const id = req.params.id
        await issuetracker.findByIdAndDelete(id)
        res.status(200).json({ status: 200, message: "Bug Deleted ", error: false })
    } catch (error) {
        res.send(error)
    }
}



module.exports = { getBugs, createBugs, updateBugs, deleteBugs, assignedToMe, reportedByMe, generateBugId, getBugsBySprint, getUsersSprintData, barAssignClosed, updateSprint, updateAllBugs }

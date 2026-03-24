const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const {jwtAuthMiddleware,generateToken} = require("../jwt");
const User = require("../models/user");

const checkAdminRole = async (userId)=>{

    try {
        const user = await User.findById(userId);
        return user.role === "admin";
    } catch (error) {
        return false;
    }
}
// add candidate route
router.post("/",async (req,res)=>{
    try {

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: "not authorized"});
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({error: "internal server error"});
        console.log(error);
    }
});

// update candidate route
router.put("/:candidateId", async (req,res)=>{
    try {
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: "not authorized"});
        }

        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData, {
            new: true,
            runValidators: true
        });

        if(!response){
            return res.status(401).json({message: "candidate not found"});
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal server error"});
    }
});

//delete candidate
router.delete("/:candidateId", async (req,res)=>{
    try {
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: "not authorized"});
        }

        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);
        
        if(!response){
            return res.status(401).json({message: "candidate not found"});

        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal server error"});
    }
})
module.exports = router;
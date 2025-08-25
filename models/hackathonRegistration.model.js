const mongoose = require('mongoose')

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    college: { type: String, required: true, trim: true }
});

const HackathonRegistrationSchema = new mongoose.Schema(
    {   
        teamName: {
            type: String,
            required: true,
            trim: true
        },

        teamLeader: TeamMemberSchema,
        
        teamMembers: [TeamMemberSchema],
        
        problemStatement: {
            title: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true }
        },

        // field to store all participants emails for easy look-up and email sharing
        participants_emails: [{ type: String, lowercase: true, index: true }]
    },
    {
        timestamps: true
    }
)

// middleware to auto-maintain participants
HackathonRegistrationSchema.pre("save", function (next) {
    const leaderEmail = this.teamLeader?.email ? this.teamLeader.email.toLowerCase() : null;
    const memberEmails = this.teamMembers.map(m => m.email.toLowerCase());

    this.participants_emails = [leaderEmail, ...memberEmails].filter(Boolean);

    next();
});

// also handle updates via findOneAndUpdate
HackathonRegistrationSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();

    // normalize $set updates
    const set = update.$set || update;

    if (set.teamLeader || set.teamMembers) {
        // fetch the existing doc to merge data
        const docToUpdate = await this.model.findOne(this.getQuery());
        const leader = set.teamLeader || docToUpdate.teamLeader;
        const members = set.teamMembers || docToUpdate.teamMembers;

        const leaderEmail = leader?.email?.toLowerCase();
        const memberEmails = (members || []).map(m => m.email.toLowerCase());

        set.participants_emails = [leaderEmail, ...memberEmails].filter(Boolean);
        update.$set = set;
    }

    next();
});

module.exports = mongoose.model("HackathonRegistration", HackathonRegistrationSchema)
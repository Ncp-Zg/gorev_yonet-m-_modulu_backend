const mongoose = require("mongoose");

const jobCreateSchema = mongoose.Schema(
  {
    messageType: {
      type: String,
      required: true,
    },
    externalReferenceId: {
      type: String,
      required: true,
    },
    taskList: [
      {
        actionName: {
          type: String,
          required: true,
        },
        locationId: {
          type: String,
          required: true,
        },
      }
    ],
    jobStatus: {
        type:String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const JobCreate = mongoose.model("jobCreate", jobCreateSchema);

module.exports = JobCreate;

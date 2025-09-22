const API = {
  getSpreadsheetData: (tabName) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getSpreadsheetData(tabName);
    });
  },
  
  getScheduleData: () => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getScheduleData();
    });
  },
  
  saveExperimentalEnrollment: (enrollmentData) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .saveExperimentalEnrollment(enrollmentData);
    });
  },
  
  appendRows: (sheetName, rows) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .appendRows(sheetName, rows);
    });
  },
  
  getDriveImage: (fileId) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getDriveImage(fileId);
    });
  }
};

export default API; 
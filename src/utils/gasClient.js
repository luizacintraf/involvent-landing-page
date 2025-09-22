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

  saveContactData: (contactData) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .saveContactData(contactData);
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
  },

  getFreeWeekData: () => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((result) => {
          // Garantir que sempre retorna um objeto válido
          resolve(result || { success: false, error: 'Resposta vazia do servidor' });
        })
        .withFailureHandler((error) => {
          console.error('Erro na chamada getFreeWeekData:', error);
          resolve({ success: false, error: error.toString() });
        })
        .getFreeWeekData();
    });
  },

  testFreeWeekSheet: () => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((result) => {
          // Garantir que sempre retorna um objeto válido
          resolve(result || { success: false, error: 'Resposta vazia do servidor' });
        })
        .withFailureHandler((error) => {
          console.error('Erro na chamada testFreeWeekSheet:', error);
          resolve({ success: false, error: error.toString() });
        })
        .testFreeWeekSheet();
    });
  }
};

export default API; 
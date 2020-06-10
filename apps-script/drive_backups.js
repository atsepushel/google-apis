var BACKUP_FOLDER_ID = '1MZtWic13NRc2gHke2QP1YblLIZ0WILlI';
var TIME_ZONE = 'GMT+3';

var NATIVE_MIME_TYPES = {};
NATIVE_MIME_TYPES[MimeType.GOOGLE_DOCS] = MimeType.MICROSOFT_WORD;
NATIVE_MIME_TYPES[MimeType.GOOGLE_SHEETS] = MimeType.MICROSOFT_EXCEL;
NATIVE_MIME_TYPES[MimeType.GOOGLE_SLIDES] = MimeType.MICROSOFT_POWERPOINT;

var NATIVE_EXTENSIONS = {};
NATIVE_EXTENSIONS[MimeType.GOOGLE_DOCS] = '.docx';
NATIVE_EXTENSIONS[MimeType.GOOGLE_SHEETS] = '.xlsx';
NATIVE_EXTENSIONS[MimeType.GOOGLE_SLIDES] = '.pptx';

var BACKUP_MIME_TYPES = Object.keys(NATIVE_MIME_TYPES);

function backupAll() {
  
  const backupFolder = generateFolderWithDate(BACKUP_FOLDER_ID);
  
  BACKUP_MIME_TYPES.forEach(function(mimeType) {
    var files = DriveApp.getFilesByType(mimeType);
    while (files.hasNext()) {
      var file = files.next();
      // no need check owner, we need all files
//      if (file.getOwner() && file.getOwner().getEmail() == Session.getActiveUser().getEmail()) {
        backup(file, backupFolder);
//      }
    }
  });
}

function generateFolderWithDate(folder) {
  
  var backupFolder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
  
  // generate new folder yyyy_MM_dd__uuid
  backupFolder = backupFolder.createFolder(Utilities.formatDate(new Date(), TIME_ZONE, "yyyy_MM_dd") + "__" + Utilities.getUuid());
  
  return backupFolder;
}

function backup(file, folder) {
  var targetName = file.getName() + ' ' + file.getId();
  var lastUpdated = file.getLastUpdated();
  
  var pdf = getPdfBlob(file);
  var native = getNativeBlob(file);
  
  var zip = Utilities.zip([pdf, native], targetName + '.zip');
  
  createOrUpdateFileForBlob(zip, folder, lastUpdated);
}

function createOrUpdateFileForBlob(blob, folder, ifOlderThan) {
  var existingFiles = folder.getFilesByName(blob.getName());
  if (existingFiles.hasNext()) {
    var file = existingFiles.next();
    if (file.getLastUpdated() < ifOlderThan) {
      updateFile(file, blob);
    }
  } else {
    folder.createFile(blob);
  }
}

function updateFile(file, blob) {
  const url = 'https://www.googleapis.com/upload/drive/v2/files/' + file.getId() + '?uploadType=media';
  
  const params = {
    method: 'put',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: blob
  };
  
  var response = UrlFetchApp.fetch(url, params);
  
  if (response.getResponseCode() < 200 || response.getResponseCode() > 299) {
    throw 'Failed to update file named ' + file.getName();
  }
}

function getPdfBlob(file) {
  var blob = file.getAs('application/pdf');
  return blob;
}

function getNativeBlob(file) {
  const nativeMimeType = NATIVE_MIME_TYPES[file.getMimeType()];
  
  const extension = NATIVE_EXTENSIONS[file.getMimeType()];
  
  const url = 'https://www.googleapis.com/drive/v2/files/' + file.getId() + '/export?mimeType=' + nativeMimeType;

  const params = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  };
  
  const blob = UrlFetchApp.fetch(url, params).getBlob();
  
  blob.setName(file.getName() + extension);
  return blob;
}
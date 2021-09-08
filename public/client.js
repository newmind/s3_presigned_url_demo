// Requires jQuery and blueimp's jQuery.fileUpload
var credentialsUrl = "/geturl";

window.initS3FileUpload = function ($fileInput) {
  $fileInput.fileupload({
    // acceptFileTypes: acceptFileType,
    // maxFileSize: maxFileSize,
    paramName: "file",
    add: s3add,
    dataType: "xml",
    done: onS3Done,
  });
};
// This function retrieves s3 parameters from our server API and appends them
// to the upload form.
function s3add(e, data) {
  var filename = data.files[0].name;
  var contentType = data.files[0].type;
  var params = [];
  $.ajax({
    url: credentialsUrl,
    type: "GET",
    dataType: "json",
    data: {
      filename: filename,
      content_type: contentType,
    },
    success: function (s3Data) {
      var fileUri = s3Data.url + "/" + s3Data.fields.key;
      console.log("------- uploading to : " + fileUri);

      data.url = s3Data.url; // upload base url
      data.formData = s3Data.fields;
      data.submit();
    },
  });
  return params;
}

function onS3Done(e, data) {
  var uploadedUri = data.url + "/" + data.formData.key;
  console.log("------- uploaded : " + uploadedUri);

  var s3Url = $(data.jqXHR.responseXML).find("Location").text();
  var elem = document.getElementById("fileInput");
  elem.style.display = "none";
  console.log($("<p/>").text("File uploaded successfully").appendTo($("body")));
  $("<img>", { id: "uploadedImage", src: uploadedUri }).appendTo($("body"));
}

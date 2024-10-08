const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3000;

fetch(`http://localhost:${PORT}/upload-file`, {
  method: 'POST',
  // body: formData
})
  .then((res) => {
    console.warn(res);
  })
  .catch((e) => {
    process.exit(e);
  });

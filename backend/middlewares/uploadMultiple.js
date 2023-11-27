const upload = require('../helpers/upload.helper')


exports.uploadMultiple = async (req, res, next) => {
  console.log(req)
    upload.array('File', 5)(req, res, (err) => {
      console.log(req.files)

        if (err) {
          return res.status(400).json({ error: err.message });
        }

        // console.log(req.files)
    
        // Retrieve uploaded files
        const files = req.files;
        const errors = [];
    
        // Validate file types and sizes
        files.forEach((file) => {
          const allowedTypes = ['image/jpeg', 'image/png'];
          const maxSize = 5 * 1024 * 1024; // 5MB
    
          if (!allowedTypes.includes(file.mimetype)) {
            errors.push(`Invalid file type: ${file.originalname}`);
          }
    
          if (file.size > maxSize) {
            errors.push(`File too large: ${file.originalname}`);
          }
        });
    
        // Handle validation errors
        if (errors.length > 0) {
          // Remove uploaded files
          files.forEach((file) => {
            fs.unlinkSync(file.path);
          });
    
          return res.status(400).json({ errors });
        }
    
        // Attach files to the request object
        req.files = files;
    
        // Proceed to the next middleware or route handler
        next();
      });
    
}
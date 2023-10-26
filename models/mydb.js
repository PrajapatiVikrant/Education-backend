const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/editordata',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
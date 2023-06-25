const express = require('express')

const AdminRouter = require('./routes/admin.routes')
const CityRouter = require('./routes/city.routes')
const FpRouter = require('./routes/fp.routes')
const ReviewRouter = require('./routes/review.routes')
const UserRouter = require('./routes/user.routes')

const PORT = process.env.PORT || 8080
const cors = require('cors');

const app = express()

app.use(cors());
app.options('*', cors());
app.use(express.json());

app.use('/AR', AdminRouter);
app.use('/CR', CityRouter);
app.use('/FR', FpRouter);
app.use('/RR', ReviewRouter);
app.use('/UR', UserRouter)


app.listen(PORT, ()=>console.log('server started on port', PORT))
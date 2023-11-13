import mongoose from 'mongoose';
import app from './app';
import { PORT, DB_URL } from './config';
import { Server } from 'http';
import { serverExitHandler } from './errors/serverExitHandler';

// this is for sync udefined/null value error handler , so it is at top !
// this type of error can be deected by global error handler also.
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

let server: Server;

async function connectDb() {
  try {
    await mongoose.connect(DB_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: 'majority', 
      wtimeout: 5000,
    } as mongoose.ConnectOptions);
    console.log('Database connection established !');
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

// async error handler
// this type of error can not be deected by global error handler.
process.on('unhandledRejection', error => {
  serverExitHandler(server, error);
});

connectDb();

//signal termination handler
//server will be closed if specific signal is received by process manager on emergency.
process.on('SIGTERM', () => {
  if (server) {
    console.log('SIGTERM is received');
    server.close();
  }
});

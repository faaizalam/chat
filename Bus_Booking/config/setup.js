// config/setup.js
import dotenv from 'dotenv';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';

import { dark, light, noSidebar } from '@adminjs/themes';
import User from '../model/user.js';
import Ticket from '../model/ticket.js';
import Bus from '../model/bus.js';

dotenv.config();

// ---------- AdminJS Setup ----------
AdminJS.registerAdapter(AdminJSMongoose);

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_LOGIN_EMAIL,
  password: process.env.ADMIN_LOGIN_PASSWORD,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const buildAdminJs = app => {
  const admin = new AdminJS({
    resources: [
      { resource: User },
      {
        resource: Bus,
        options: {
          properties: {
            seats: { isVisible: false },
          },
        },
      },
      { resource: Ticket },
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Bus Booking Admin',
      withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
  });
  const MongoDBStore = ConnectMongoDBSession(session);
  const store = new MongoDBStore({
    uri: process.env.MONGO_URI, // your MongoDB connection string
    collection: 'sessions',
  });

  // Handle errors
  store.on('error', function (error) {
    console.error('Session store error:', error);
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_PASSWORD || 'cookiesecret',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      store: store,
      secret: process.env.COOKIE_PASSWORD || 'cookiesecret',
      cookie: {
        secure: process.env.NODE_ENV === 'production', // set to true in production
        httpOnly: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, // 1 hour
      },
      name: 'adminjs',
    },
  );
  app.use(admin.options.rootPath, adminRouter);
};

import getConfig from 'next/config';
import mysql from 'mysql2/promise';
import { Model, ModelCtor, Sequelize } from 'sequelize';
import userModel,{UserModelStatic} from './models/user.model';
import clientModel, { ClientModelStatic } from './models/client.model';
import invoiceModel, { InvoiceModelStatic } from './models/invoice.model';
import templateModel, { TemplateModelStatic } from './models/template.model';
import teamModel, { TeamModelStatic } from './models/team.model';
import { Dialog } from '@radix-ui/react-dialog';
import mysql2 from 'mysql2'


const { serverRuntimeConfig } = getConfig();
interface DB {
  initialized:boolean,
  initialize: ()=>Promise<void>,
  Client:ClientModelStatic,
  Team:TeamModelStatic,
  User:UserModelStatic,
  Invoice:InvoiceModelStatic,
  Template:TemplateModelStatic
}
export const db:DB = {
  initialized: false,
  initialize,
  Client:undefined as any,
  Team:undefined as any,
  User:undefined as any,
  Invoice:undefined as any,
  Template:undefined as any,

};

// initialize db and models, called on first api request from /helpers/api/api-handler.js
async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
  const connection = await mysql.createConnection({ host, port, user, password});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  // jdbc:mysql://localhost:32768/?
  // connect to db
  const sequelize = new Sequelize( database,user,password,{
    dialectModule:mysql2,
    dialect:"mysql"
  });

  // init models and add them to the exported db object

  db.Client = clientModel(sequelize) ;
  db.Template = templateModel(sequelize) ;
  db.Team = teamModel(sequelize) ;
  db.User = userModel(sequelize, db.Team) ;
  db.Invoice = invoiceModel(sequelize, db.Client, db.Template, db.Team) ;


  db.Team.hasMany(db.User, { foreignKey: "teamId" })
  db.Team.hasMany(db.Invoice, { foreignKey: "teamId" })

  db.Client.hasMany(db.Invoice, { foreignKey: "importerId" })
  db.Client.hasMany(db.Invoice, { foreignKey: "clientId" })

  db.Template.hasMany(db.Invoice, { foreignKey: "templateId" })

  db.Invoice.belongsTo(db.Template, { foreignKey: "templateId" })
  db.Invoice.belongsTo(db.Client, { foreignKey: "importerId" })
  db.Invoice.belongsTo(db.Client, { foreignKey: "clientId" })
  db.Invoice.belongsTo(db.Team, { foreignKey: "teamId" })



  // sync all models with database
 try{
  await sequelize.sync({ alter: true });
 }catch(err){
    console.log("error", JSON.stringify(err))
 }

  db.initialized = true;
}

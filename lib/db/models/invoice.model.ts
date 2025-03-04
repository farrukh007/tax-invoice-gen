
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
interface InvoiceAttributes {
    readonly invoiceNumber: string;
    readonly invoiceDate: string;
    readonly id: string;

    readonly clientId: any;
    readonly importerId: any;
    readonly templateId: any;
    readonly teamId: any;
    readonly goods: string;
    readonly goodNumber: string;
    readonly hsCODE: string;
    readonly FBRCode: string;
    readonly quantityUnits: number;
    readonly value: number;
    readonly GST: number;
    readonly VAT: number;
    readonly unitPrice: number;
    readonly createdAt: Date;





}
export interface InvoiceInstance extends Model<InvoiceAttributes>, InvoiceAttributes { }
export type InvoiceModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): InvoiceInstance;
};
export default function invoiceModel(sequelize: Sequelize,clientModel:any, templateModel:any,teamModel:any) {
    const attributes :any= {
        invoiceNumber: { type: DataTypes.STRING, allowNull: false,unique:true },
        invoiceDate: { type: DataTypes.STRING, allowNull: false },
        clientId:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: clientModel, // References the User model
              key: "id",   // Refers to the id column in User
            },
            onUpdate: "CASCADE", // Update userId in Post if id in User changes
            onDelete: "CASCADE", // Delete Posts if the associated User is deleted
          },
          importerId:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: clientModel, // References the User model
              key: "id",   // Refers to the id column in User
            },
            onUpdate: "CASCADE", // Update userId in Post if id in User changes
            onDelete: "CASCADE", // Delete Posts if the associated User is deleted
          },
          templateId:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: templateModel, // References the User model
              key: "id",   // Refers to the id column in User
            },
            onUpdate: "CASCADE", // Update userId in Post if id in User changes
            onDelete: "CASCADE", // Delete Posts if the associated User is deleted
          },
          teamId:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: teamModel, // References the User model
              key: "id",   // Refers to the id column in User
            },
            onUpdate: "CASCADE", // Update userId in Post if id in User changes
            onDelete: "CASCADE", // Delete Posts if the associated User is deleted
          },
          goods:{type: DataTypes.STRING, allowNull: false},
          goodNumber:{type: DataTypes.STRING, allowNull: false},
          hsCODE:{type: DataTypes.STRING, allowNull: false},
          FBRCode:{type: DataTypes.STRING, allowNull: false},
          quantityUnits:{type: DataTypes.INTEGER, min:1},
          value:{type: DataTypes.INTEGER,min:1},
          GST:{type: DataTypes.INTEGER,min:0},
          VAT:{type: DataTypes.INTEGER,min:0},
          unitPrice:{type: DataTypes.INTEGER,min:1},

    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    } as any;

    return sequelize.define('invoice', attributes, options) as InvoiceModelStatic;
}
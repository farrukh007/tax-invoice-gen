
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
export interface UserAttributes {
    readonly id: number;
    readonly username: string;
    readonly hash: string;
    readonly firstName: string;

    readonly lastName: string;

    readonly role: string;
    readonly teamId: any;


  }
  export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
  export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserInstance;
  };
export default function userModel(sequelize: Sequelize,teamModel:any) {
    const attributes :any= {
        username: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        teamId:  {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                      model: teamModel, // References the User model
                      key: "id",   // Refers to the id column in User
                    },
                    onUpdate: "CASCADE", // Update userId in Post if id in User changes
                    onDelete: "CASCADE", // Delete Posts if the associated User is deleted
                  }
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

    return sequelize.define('user', attributes, options) as UserModelStatic;
}
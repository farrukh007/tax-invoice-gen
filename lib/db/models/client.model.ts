
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
interface ClientAttributes {
    readonly id: string;

    readonly bussinessName: string;
    readonly name: string;

    readonly cnic: string;
    readonly ntn: string;
    readonly address: string;
    readonly phone: string;
    readonly type: string;
    readonly createdAt: Date;



}
export interface ClientInstance extends Model<ClientAttributes>, ClientAttributes { }
export type ClientModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): ClientInstance;
};
export default function clientModel(sequelize: Sequelize) {
    const attributes = {
        bussinessName: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        cnic: {
            type: DataTypes.STRING, allowNull: false, validate: {
                is: /^\d{5}-\d{7}-\d{1}$/
            }
        },
        ntn: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.ENUM, allowNull: false, values: ['importer', 'client'] },

    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['cnic'] }
        },
        scopes: {
            // include hash with this scope
            withCNIC: { attributes: {}, }
        }
    } as any;

    return sequelize.define('client', attributes, options) as ClientModelStatic;
}
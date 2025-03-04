
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
interface TeamAttributes {
    readonly name: string;
    readonly id: string;


}
export interface TeamInstance extends Model<TeamAttributes>, TeamAttributes { }
export type TeamModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): TeamInstance;
};
export default function teamModel(sequelize: Sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
    } as any;

    return sequelize.define('team', attributes, options) as TeamModelStatic;
}
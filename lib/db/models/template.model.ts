
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
interface TemplateAttributes {
    readonly name: string;
    readonly id: string;



}
export interface TemplateInstance extends Model<TemplateAttributes>, TemplateAttributes { }
export type TemplateModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): TemplateInstance;
};
export default function templateModel(sequelize: Sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
    } as any;

    return sequelize.define('template', attributes, options) as TemplateModelStatic;
}
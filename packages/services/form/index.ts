import {db, eq, asc} from "@repo/database"
import {formsTable} from "@repo/database/models/form"
import {formsfieldsTable} from "@repo/database/models/form-fields"
import { type createFormInputType, createFormInput, listFormsByUserIdInputType, listFormsByUserIdInput, getFormByIdInputType, getFormByIdInput } from "./model"

class FormService {

    public async createForm(paylaod: createFormInputType) {
        const {title, description, createdBy} = await createFormInput.parseAsync(paylaod) 
        const result = await db.insert(formsTable).values({title,description,createdBy}).returning({
            id:formsTable.id
        })
     if(!result || result.length === 0 || !result[0]?.id){
            throw new Error(`Something went wrong while creating form`)
        }
        return {id: result[0].id}
    }

    public async listFormsByUserId(payload: listFormsByUserIdInputType){
        const {userId} = await listFormsByUserIdInput.parseAsync(payload)

        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.createdBy, userId))
        return forms
    }

    public async getFormById(payload: getFormByIdInputType){
        const {formId} = await getFormByIdInput.parseAsync(payload)

        const rows = await db.select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,    
                field: {
                    id: formsfieldsTable.id,
                    label: formsfieldsTable.label,
                    labelKey: formsfieldsTable.labelKey,
                    type: formsfieldsTable.type,
                    description: formsfieldsTable.description,
                    placeholder: formsfieldsTable.placeholder,
                    isRequired: formsfieldsTable.isRequired,
                    index: formsfieldsTable.index,                   
                }
        }).from(formsTable)
          .leftJoin(formsfieldsTable, eq(formsfieldsTable.formId, formsTable.id))
          .where(eq(formsTable.id, formId))
          .orderBy(asc(formsfieldsTable.index))


        const { id, title, description, createdAt, updatedAt } = rows[0]!
        const fields = rows.filter(r => r.field?.id !== null)
            .map(r => r.field as NonNullable<typeof r.field>)

        return { id, title, description, createdAt, updatedAt, fields }
    }
}

export default FormService
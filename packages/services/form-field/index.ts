import {db, eq, max, asc} from "@repo/database" 
import {formsfieldsTable} from "@repo/database/models/form-fields"
import {
    type createFieldInputType, createFieldInput,
    type updateFieldInputType, updateFieldInput,
    type deleteFieldInputType, deleteFieldInput,
    type getFieldInputType, getFieldInput
} from "./model"

function toLabelKey(label: string): string{
    return label.toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g,'_')
                .replace(/^_|_$/g,"")
}

class FormFieldService {

    private async getNextIndex(formId: string): Promise<string> {
        const result = await db.select({maxIndex: max(formsfieldsTable.index)})
                         .from(formsfieldsTable)
                         .where(eq(formsfieldsTable.formId, formId))

       const current = result[0]?.maxIndex
       const next = current ? parseFloat(current) + 1 : 1;
       return next.toFixed(2)
    }

    public async createField(paylaod: createFieldInputType){
        const {label, type, formId, description, placeholder, isRequired} = await createFieldInput.parseAsync(paylaod)

        const labelKey = toLabelKey(label)
        const index = await this.getNextIndex(formId)

        const result = await db.insert(formsfieldsTable)
                         .values({label, labelKey, type, formId, description, placeholder, isRequired, index})
                         .returning({id: formsfieldsTable.id})

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error("Something went wrong while creating the field")
    }

    return {id: result[0].id, labelKey, index}
    }

    public async updateField(paylaod: updateFieldInputType){
        const {fieldId, ...update} = await updateFieldInput.parseAsync(paylaod)

        const patch: Partial<typeof formsfieldsTable.$inferInsert> = {}

        if(update.label !== undefined) patch.label = update.label
        if(update.type !== undefined) patch.type = update.type
        if('description' in update) patch.description = update.description ?? null
        if('placeholder' in update) patch.placeholder = update.placeholder ?? null
        if(update.isRequired !== undefined) patch.isRequired = update.isRequired

        if(Object.keys(patch).length === 0 ) throw new Error("No field provided to update")

        const result = await db
                         .update(formsfieldsTable)
                         .set(patch)
                         .where(eq(formsfieldsTable.id, fieldId))
                         .returning({id: formsfieldsTable.id})

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error(`Field with id ${fieldId} does not exist`)
        }

    return {id: result[0].id}
    }

    public async deleteField(payload: deleteFieldInputType){
        const {fieldId} = await deleteFieldInput.parseAsync(payload)

        const result = await db
                        .delete(formsfieldsTable)
                        .where(eq(formsfieldsTable.id, fieldId))
                        .returning({id: formsfieldsTable.id})

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error(`Field with id ${fieldId} does not exist`)
        }

        return {id: result[0]?.id}
    }

    public async getFields(payload: getFieldInputType){

        const {formId} = await getFieldInput.parseAsync(payload)

        const result = await db
                            .select({
                                id: formsfieldsTable.id,
                                label: formsfieldsTable.label,
                                labelKey: formsfieldsTable.labelKey,
                                type: formsfieldsTable.type,
                                description: formsfieldsTable.description,
                                placeholder: formsfieldsTable.placeholder,
                                isRequired: formsfieldsTable.isRequired,
                                index: formsfieldsTable.index
                            })
                            .from(formsfieldsTable)
                            .where(eq(formsfieldsTable.formId, formId))
                            .orderBy(asc(formsfieldsTable.index))

        return result
    }
}

export default FormFieldService
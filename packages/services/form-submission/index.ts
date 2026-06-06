import { db, eq, desc } from '@repo/database'
import { formSubmissionsTable } from '@repo/database/models/form-submissions'
import { SubmitFormInputType, submitFormInput, type GetFormSubmissionsInputType, getFormSubmissionsInput } from './module'

class FormSubmissionService {

    public async submitForm(payload: SubmitFormInputType){
    const {formId, values} = await submitFormInput.parseAsync(payload)

    const result = await db.insert(formSubmissionsTable)
                     .values({formId, value: values})
                     .returning({id: formSubmissionsTable.id})

    if (!result || result.length === 0 || !result[0]?.id)
            throw new Error('Something went wrong while saving your submission')

    return { id: result[0].id }
  }

      public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
        const { formId } = await getFormSubmissionsInput.parseAsync(payload)

        return await db
            .select({
                id: formSubmissionsTable.id,
                values: formSubmissionsTable.value,
                createdAt: formSubmissionsTable.createdAt,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(desc(formSubmissionsTable.createdAt))
    }
}

export default FormSubmissionService
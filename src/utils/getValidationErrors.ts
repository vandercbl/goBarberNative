import { ValidationError } from 'yup'

interface Errors {
	[key: string]: string
	// dessa forma, a tipagem é genérica, onde qualquer key vai ser string e seu valor tbm.
	// fizemos assim pois são muitas propriedades do objeto e todas são string
}

export default function getValidationErrors(err: ValidationError): Errors {
	const validationErrors: Errors = {}

	err.inner.forEach((error) => {
		validationErrors[error.path] = error.message
	})

	return validationErrors
}

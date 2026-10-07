import * as Joi from 'joi';

export function validateEnv<T>(
  schema: Joi.ObjectSchema<T>,
  env: NodeJS.ProcessEnv,
): T {
  const result = schema.validate(env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (result.error) {
    console.error('Invalid environment variables:');
    result.error.details.forEach((d) => console.error(`  - ${d.message}`));
    process.exit(1);
  }

  return result.value;
}

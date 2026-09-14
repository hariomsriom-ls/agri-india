"use client";

import { useState } from "react";
import { z } from "zod";

export function useRegistrationStep<T extends object>(
  schema: z.ZodType<T>,
  initialValues: T,
) {
  const [stepData, setStepData] = useState(initialValues);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const result = validationAttempted ? schema.safeParse(stepData) : null;
  const errors: Partial<Record<keyof T, string>> = {};

  if (result && !result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof T;
      errors[field] ??= issue.message;
    }
  }

  const validate = () => {
    setValidationAttempted(true);
    const result = schema.safeParse(stepData);
    return result.success ? result.data : null;
  };

  return { stepData, setStepData, errors, validate };
}

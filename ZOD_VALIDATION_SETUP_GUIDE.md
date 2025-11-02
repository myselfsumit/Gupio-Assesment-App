# Step-by-Step Guide: Setting Up Zod Validation in React Native

## Step 1: Install Required Dependencies

Your project already has these dependencies installed:
- `zod`: "^4.1.12"
- `react-hook-form`: "^7.66.0"
- `@hookform/resolvers`: "^5.2.2"

If you need to install them in a new project, run:

```bash
# Using npm
npm install zod react-hook-form @hookform/resolvers

# OR using yarn
yarn add zod react-hook-form @hookform/resolvers

# OR using pnpm
pnpm add zod react-hook-form @hookform/resolvers
```

## Step 2: Directory Structure

The validation files are organized as:
```
src/
  validation/
    Validation.ts  (All validation schemas)
```

## Step 3: Understanding Validation Patterns

### Basic String Validation
```typescript
z.string()
  .trim()                    // Remove whitespace
  .min(1, 'Required')         // Minimum length
  .max(50, 'Too long')       // Maximum length
```

### Regex Validation
```typescript
z.string()
  .regex(/^[A-Z]{4}\d{4}$/, 'Invalid format')
```

### Custom Transformation
```typescript
z.string()
  .transform((val) => val.toUpperCase()) // Auto-convert to uppercase
```

### Custom Refinement (Complex Logic)
```typescript
z.string()
  .refine(
    (val) => val !== 'INVALID',
    'This value is not allowed'
  )
```

### Optional Fields
```typescript
z.string().optional()
```

### Email Validation
```typescript
z.string().email('Invalid email address')
```

### Number Validation
```typescript
z.number()
  .min(0, 'Must be positive')
  .max(100, 'Must be less than 100')
```

## Step 4: Best Practices

1. **Always export the TypeScript type:**
   ```typescript
   export type FormData = z.infer<typeof schemaName>;
   ```

2. **Use `.transform()` for automatic formatting:**
   ```typescript
   .transform((val) => val.toUpperCase())
   ```

3. **Chain validations in logical order:**
   - `.trim()` first
   - Then `.min()`, `.max()`
   - Then `.regex()`
   - Finally `.transform()` or `.refine()`

4. **Use `mode: 'onChange'` for real-time validation:**
   ```typescript
   useForm<FormData>({
     resolver: zodResolver(schema),
     mode: 'onChange',
     reValidateMode: 'onChange',
   });
   ```

5. **Group related schemas together in the same file**

## Step 5: Integration Example

See `src/validation/Validation.ts` for all schemas and `src/screens/LoginScreen.tsx` for integration example.

## Step 6: Testing Your Setup

Test your validation:
- Try submitting empty fields (should show errors)
- Enter invalid formats (regex should catch them)
- Verify transformations (uppercase, trim, etc.)
- Check that `isValid` becomes `true` only when all fields are valid

## Common Issues & Solutions

**Issue:** TypeScript errors on form fields  
**Solution:** Ensure you're using the exported type: `useForm<LoginFormData>()`

**Issue:** Validation not working  
**Solution:** Check that `resolver: zodResolver(loginSchema)` is set

**Issue:** Transform not working  
**Solution:** Transform happens after validation, ensure data flows through the schema

**Issue:** Errors not showing  
**Solution:** Check `formState: { errors }` is destructured and errors are accessed correctly

## All Validation Schemas Included

1. **Login Schema** - Employee ID and Password validation
2. **Signup Schema** - Full name, Email, Phone, Employee ID, Password, Confirm Password, Gender
3. **Profile Update Schema** - Name, Email, Phone validation
4. **Forgot Password Schema** - Employee ID or Phone validation
5. **OTP Schema** - 6-digit OTP validation

All schemas are ready to use in your components!


# Indian Vehicle Number Validation - Explanation

## Overview
यह document Indian vehicle number format और उसकी validation के बारे में explain करता है।

## Indian Vehicle Number Format (भारतीय वाहन नंबर प्रारूप)

### Basic Format Structure
```
XX##XX####
```

### Breakdown (विस्तार):
1. **XX** - State Code (राज्य कोड)
   - 2 uppercase letters (बड़े अक्षर)
   - Example: `MH` (Maharashtra), `DL` (Delhi), `UP` (Uttar Pradesh)

2. **##** - District/RTO Code (जिला/RTO कोड)
   - 2 digits (00 से 99 तक)
   - Example: `12`, `01`, `99`

3. **XX** - Series (सीरीज़)
   - 2 uppercase letters (बड़े अक्षर)
   - Example: `AB`, `CD`, `XY`

4. **####** - Vehicle Number (वाहन नंबर)
   - 4 digits (0001 से 9999 तक)
   - Example: `1234`, `0001`, `5678`

### Complete Examples:
```
MH12AB1234  ✅ Correct
DL01XY9876  ✅ Correct
UP99CD0001  ✅ Correct
KA05EF5678  ✅ Correct
```

## Validation Rules (वैलिडेशन नियम)

### 1. Length (लंबाई)
- **Total characters:** Exactly 10 (without spaces)
- **With spaces:** Can be entered as `MH 12 AB 1234` (13 characters), but spaces are automatically removed

### 2. Pattern (पैटर्न)
```
Format: [State Code][District Code][Series][Vehicle Number]
Pattern: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/
```

### 3. State Code Validation (राज्य कोड वैलिडेशन)
Supported Indian state codes:
- **North:** DL (Delhi), UP (Uttar Pradesh), HR (Haryana), PB (Punjab), HP (Himachal Pradesh), JK (Jammu & Kashmir), UT (Uttarakhand)
- **West:** MH (Maharashtra), GJ (Gujarat), RJ (Rajasthan), MP (Madhya Pradesh)
- **South:** KA (Karnataka), TN (Tamil Nadu), AP (Andhra Pradesh), KL (Kerala), TS (Telangana)
- **East:** WB (West Bengal), OR (Odisha), BR (Bihar), AS (Assam)
- **Northeast:** TR (Tripura), MN (Manipur), ML (Meghalaya), MZ (Mizoram), NL (Nagaland)
- **Union Territories:** CH (Chandigarh), DN (Dadra & Nagar Haveli), PY (Puducherry), LD (Lakshadweep), AN (Andaman & Nicobar), SK (Sikkim), GA (Goa)

## How It Works in Our App (हमारे ऐप में कैसे काम करता है)

### 1. User Input (यूजर इनपुट)
User vehicle number enter करता है:
```
Input: "mh12ab1234" (lowercase या mixed case)
```

### 2. Automatic Transformation (ऑटोमेटिक ट्रांसफॉर्मेशन)
- Spaces automatically remove हो जाते हैं
- All characters uppercase में convert हो जाते हैं
- Result: `MH12AB1234`

### 3. Validation Steps (वैलिडेशन स्टेप्स)

#### Step 1: Required Check
- Field empty नहीं होना चाहिए
- Error: "Vehicle number is required"

#### Step 2: Length Check
- Exactly 10 characters होने चाहिए
- Error: "Vehicle number must be exactly 10 characters (e.g., MH12AB1234)"

#### Step 3: Format Check
- Pattern match होना चाहिए: `XX##XX####`
- Error: "Invalid vehicle number format. Use Indian format: XX##XX#### (e.g., MH12AB1234)"

#### Step 4: State Code Check
- First 2 characters valid Indian state code होना चाहिए
- Error: "Invalid state code. Please enter a valid Indian state code (e.g., MH, DL, UP, KA)"

### 4. Error Display (एरर डिस्प्ले)
अगर validation fail होती है, तो:
- Input field red border के साथ दिखता है
- Error message field के नीचे display होता है
- Submit button disabled रहता है जब तक valid input न हो

## Code Implementation (कोड इंप्लीमेंटेशन)

### Zod Schema:
```typescript
export const vehicleNumberSchema = z.object({
  vehicleNumber: z
    .string()
    .trim()
    .min(1, 'Vehicle number is required')
    .transform((val) => val.replace(/\s+/g, '').toUpperCase())
    .pipe(
      z
        .string()
        .length(10, 'Vehicle number must be exactly 10 characters')
        .regex(
          /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
          'Invalid vehicle number format'
        )
        .refine(
          (val) => {
            const stateCode = val.substring(0, 2);
            // Check against valid state codes
            return validStateCodes.includes(stateCode);
          },
          {
            message: 'Invalid state code',
          }
        )
    ),
});
```

### React Hook Form Integration:
```typescript
const { control, handleSubmit, formState: { errors, isValid } } = useForm({
  resolver: zodResolver(vehicleNumberSchema),
  mode: 'onChange',
});
```

## Common Examples (सामान्य उदाहरण)

### Valid Examples:
| Input (User) | After Transform | Valid? |
|--------------|-----------------|--------|
| `mh12ab1234` | `MH12AB1234` | ✅ Yes |
| `MH 12 AB 1234` | `MH12AB1234` | ✅ Yes |
| `DL01XY9876` | `DL01XY9876` | ✅ Yes |
| `up 99 cd 0001` | `UP99CD0001` | ✅ Yes |

### Invalid Examples:
| Input | Reason | Error Message |
|-------|--------|---------------|
| `MH123AB1234` | Wrong length | "Vehicle number must be exactly 10 characters" |
| `MH12AB123` | Missing digit | "Vehicle number must be exactly 10 characters" |
| `12AB1234` | Missing state code | "Invalid vehicle number format" |
| `MH12AB12` | Missing digits | "Invalid vehicle number format" |
| `XX12AB1234` | Invalid state code | "Invalid state code" |

## Benefits (फायदे)

1. **Data Quality:** सही format ensure करता है
2. **User Experience:** Real-time validation से immediate feedback मिलता है
3. **Database Consistency:** सभी vehicle numbers same format में store होते हैं
4. **Error Prevention:** Invalid data entry से बचाता है

## Summary (सारांश)

Indian vehicle number validation:
- **Format:** `XX##XX####` (10 characters)
- **State Code:** Valid Indian state code (2 uppercase letters)
- **District Code:** 2 digits (00-99)
- **Series:** 2 uppercase letters
- **Vehicle Number:** 4 digits (0001-9999)
- **Auto-transformation:** Spaces remove, uppercase convert
- **Real-time validation:** User type करते समय validate होता है

---

**Note:** यह validation Indian vehicle number format के लिए है। अगर app में other countries के vehicle numbers भी support करने हैं, तो additional validation patterns add करने होंगे।


# TypeScript Module Resolution Fix

## Problem
TypeScript cannot find the module `@react-native-async-storage/async-storage` or its type declarations, even though the package is installed.

## Root Causes

1. **TypeScript Cache Issues**: TypeScript's language server caches type information and may not pick up newly installed or updated packages
2. **Module Resolution Configuration**: Expo's default `tsconfig.json` may not properly resolve types from `node_modules`
3. **Stale Metro Bundler Cache**: The Metro bundler cache can hold outdated module references
4. **Missing Type Declarations**: Sometimes type declaration files exist but aren't referenced correctly

## Permanent Solutions Implemented

### 1. Updated `tsconfig.json`
Added `skipLibCheck: true` to the compiler options. This tells TypeScript to skip type checking of declaration files, which can help resolve module resolution issues.

**Location**: `mobile-app/tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 2. Enhanced `declarations.d.ts`
Added a triple-slash reference directive and improved type declarations for AsyncStorage.

**Location**: `mobile-app/declarations.d.ts`
```typescript
/// <reference types="@react-native-async-storage/async-storage" />

declare module '@react-native-async-storage/async-storage' {
    export interface AsyncStorageStatic {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        // ... other methods
    }
    
    const AsyncStorage: AsyncStorageStatic;
    export default AsyncStorage;
}
```

### 3. Automated Fix Script
Created `fix-types.ps1` - a PowerShell script that automates the entire fix process.

**Usage**:
```powershell
.\fix-types.ps1
```

## Manual Fix Steps

If you encounter this error again, follow these steps:

1. **Clear all caches**:
   ```powershell
   Remove-Item -Path .expo -Recurse -Force
   Remove-Item -Path node_modules\.cache -Recurse -Force
   ```

2. **Reinstall the package**:
   ```powershell
   npm install @react-native-async-storage/async-storage
   ```

3. **Restart the Expo dev server**:
   ```powershell
   npx expo start --clear
   ```

4. **Restart TypeScript server in VS Code**:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

## IDE-Specific Fixes

### Visual Studio Code
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "TypeScript: Restart TS Server"
3. Run "Developer: Reload Window" if the issue persists

### Other IDEs
- WebStorm: Invalidate Caches and Restart
- Sublime Text: Restart LSP server
- Vim/Neovim: Restart the LSP client

## Prevention

To prevent this issue from occurring:

1. **Always run `npx expo start --clear`** after installing new packages
2. **Periodically clear caches** during development
3. **Keep dependencies updated** to avoid version conflicts
4. **Use the automated script** (`fix-types.ps1`) as a first resort

## Verification

To verify the fix worked:

```powershell
# Check TypeScript compilation
npx tsc --noEmit

# Should exit with code 0 (no errors)
```

## Related Issues

This fix also helps with:
- Other `@react-native-*` package type resolution errors
- `expo-*` package type declaration issues
- Custom module declaration problems

## Additional Resources

- [Expo TypeScript Guide](https://docs.expo.dev/guides/typescript/)
- [React Native AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

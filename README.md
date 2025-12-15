# Mortgage Calculator (Netlify-ready)

A single-page mortgage calculator tailored for marketing pages. The map/floor-plan flow has been removed; instead, the calculator ingests pricing dynamically from the hosting page.

## Behavior
- Uses a generic 1.25% tax rate (configurable via `DEFAULT_TAX_RATE` in `src/App.js`).
- Shows a tax disclaimer under the property tax field: “Property tax estimated at 1.25%. Please verify with your county/municipality.”
- Defaults to a $700,000 price so the calculator works out of the box.
- An optional “Choose Another Home” button is stubbed and commented in `src/CalculatorView.js` for future use.

## Integration options
- URL param ingestion exists in code but is commented out by default. To enable: uncomment the `useEffect` block in `src/App.js` and pass `?price=650000&unit_id=Lot-12&plan=Plan-A`.
- Global setter (enabled): call after page load:
  ```js
  window.setCalculatorUnit({
    price: 650000,     // required, number
    unit_id: 'Lot-12', // optional
    plan: 'Plan-A'     // optional
  });
  ```
  The app normalizes input; invalid/missing price will be ignored.

## Local development
```bash
npm install
npm start
```
Open http://localhost:3000. Default price is $700,000; use the global setter to override during testing.

## File references
- `src/App.js`: Calculator-only app, URL param parsing, `window.setCalculatorUnit`, tax rate constant.
- `src/CalculatorView.js`: Main UI, tax disclaimer, commented “Choose Another Home” button stub.

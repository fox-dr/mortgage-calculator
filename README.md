# Mortgage Calculator (Netlify-ready)

A single-page mortgage calculator tailored for marketing pages. The map/floor-plan flow has been removed; instead, the calculator ingests pricing dynamically from the hosting page.

## Behavior
- Uses a generic 1.25% tax rate (configurable via `DEFAULT_TAX_RATE` in `src/App.js`).
- Shows a tax disclaimer under the property tax field: “Property tax estimated at 1.25%. Please verify with your county/municipality.”
- If no price is provided, the UI prompts you to pass one via URL params or the global setter.
- An optional “Choose Another Home” button is stubbed and commented in `src/CalculatorView.js` for future use.

## Integration options (pick one or use both)
### 1) URL params (simplest)
Pass price and optional labels in the query string:
```
https://your-site.netlify.app/?price=650000&unit_id=Lot-12&plan=Plan-A
```
- `price` (required): number
- `unit_id` (optional): lot/home identifier
- `plan` (optional): plan name

### 2) Global setter (call after page load)
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
Open http://localhost:3000 and pass params as above to load a price automatically.

## File references
- `src/App.js`: Calculator-only app, URL param parsing, `window.setCalculatorUnit`, tax rate constant.
- `src/CalculatorView.js`: Main UI, tax disclaimer, commented “Choose Another Home” button stub.

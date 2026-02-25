<script lang="ts">
    import { TelInput, normalizedCountries } from 'svelte-tel-input';
    import type { CountryCode, E164Number } from 'svelte-tel-input/types';

    export let value: E164Number | string | null = null;
    export let name: string | null = null;
    export let id: string | null = null;
    export let placeholder: string | null = null;
    export let disabled = false;
    export let required = false;
    export let defaultCountry: CountryCode | null = 'AR';
    /** Llamado al perder foco con el valor actual (E.164). Útil para guardar al salir del campo. */
    export let onblur: ((value: string) => void) | null = null;

    let selectedCountry: CountryCode | null = defaultCountry;
    let valid = true;
    let internalValue: E164Number | null =
        value && value !== ''
            ? (value as E164Number)
            : defaultCountry
                ? (`+${getDialCode(defaultCountry)}` as E164Number)
                : null;

    function getDialCode(countryCode: CountryCode | null): string {
        if (!countryCode) return '';
        const c = normalizedCountries.find((x) => x.iso2 === countryCode);
        return c ? String(c.dialCode) : '';
    }

    $: if (value !== undefined && value !== null && value !== '' && String(value).trim() !== String(internalValue ?? '').trim()) {
        internalValue = value as E164Number;
    }

    function onCountrySelect() {
        const code = getDialCode(selectedCountry);
        if (code) {
            internalValue = (`+${code}` as E164Number);
        }
    }

    function flagEmoji(iso2: string): string {
        if (!iso2 || iso2.length !== 2) return '';
        return iso2
            .toUpperCase()
            .split('')
            .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
            .join('');
    }
</script>

<div
    class="phone-input-wrapper flex rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background"
    on:blur={() => onblur?.(internalValue ?? '')}
    role="group"
>
    <select
        class="country-select flex items-center gap-1.5 h-10 pl-3 pr-2 border-0 bg-muted/50 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 min-w-[100px]"
        aria-label="Código de país"
        bind:value={selectedCountry}
        on:change={onCountrySelect}
    >
        {#each normalizedCountries as country (country.id)}
            <option value={country.iso2}>
                {flagEmoji(country.iso2)} +{country.dialCode}
            </option>
        {/each}
    </select>
    <div class="tel-input-cell flex-1 min-w-0">
        <TelInput
            id={id ?? undefined}
            bind:country={selectedCountry}
            bind:value={internalValue}
            bind:valid
            class="tel-input h-10 w-full border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            {placeholder}
            {disabled}
            {required}
            options={{ autoPlaceholder: true, spaces: true, format: 'international' }}
        />
    </div>
</div>

{#if name}
    <input type="hidden" name={name} value={internalValue ?? ''} />
{/if}

<style>
    .phone-input-wrapper :global(.tel-input) {
        height: 2.5rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
    .country-select {
        -webkit-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.25rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2rem;
    }
</style>

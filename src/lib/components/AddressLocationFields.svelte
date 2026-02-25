<script lang="ts">
    import { Country, State, City } from 'country-state-city';
    import type { ICountry, IState, ICity } from 'country-state-city';

    export let country: string = '';
    export let state: string = '';
    export let city: string = '';
    export let disabled: boolean = false;
    export let labels: { country?: string; state?: string; city?: string } = {};
    const defaultLabels = { country: 'País', state: 'Estado / Provincia', city: 'Ciudad' };
    $: L = { ...defaultLabels, ...labels };

    const countries: ICountry[] = Country.getAllCountries();

    $: selectedCountry = country ? (countries.find((c) => c.name === country) || null) : null;
    $: countryCode = selectedCountry ? selectedCountry.isoCode : '';

    $: states = countryCode ? State.getStatesOfCountry(countryCode) : [];
    $: selectedState = state && states.length ? (states.find((s) => s.name === state) || null) : null;
    $: stateCode = selectedState ? selectedState.isoCode : '';

    $: cities = countryCode && stateCode ? (City.getCitiesOfState(countryCode, stateCode) || []) : [];

    function onCountryChange(e: Event) {
        const sel = e.currentTarget as HTMLSelectElement;
        const code = sel.value;
        const c = countries.find((x) => x.isoCode === code);
        country = (c && c.name) ? c.name : '';
        state = '';
        city = '';
    }
    function onStateChange(e: Event) {
        const sel = e.currentTarget as HTMLSelectElement;
        const code = sel.value;
        const s = states.find((x) => x.isoCode === code);
        state = (s && s.name) ? s.name : '';
        city = '';
    }
    function onCityChange(e: Event) {
        const sel = e.currentTarget as HTMLSelectElement;
        const name = sel.value;
        city = name;
    }
</script>

<div class="space-y-3">
    <div class="space-y-1.5">
        <label for="addr-country" class="text-sm font-medium">{L.country}</label>
        <select
            id="addr-country"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={countryCode}
            on:change={onCountryChange}
            {disabled}
        >
            <option value="">Seleccionar país</option>
            {#each countries as c}
                <option value={c.isoCode}>{c.name}</option>
            {/each}
        </select>
    </div>
    <div class="space-y-1.5">
        <label for="addr-state" class="text-sm font-medium">{L.state}</label>
        <select
            id="addr-state"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={stateCode}
            on:change={onStateChange}
            disabled={!countryCode || disabled}
        >
            <option value="">Seleccionar estado / provincia</option>
            {#each states as s}
                <option value={s.isoCode}>{s.name}</option>
            {/each}
        </select>
    </div>
    <div class="space-y-1.5">
        <label for="addr-city" class="text-sm font-medium">{L.city}</label>
        {#if stateCode && cities.length > 0}
            <select
                id="addr-city"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={city}
                on:change={onCityChange}
                {disabled}
            >
                <option value="">Seleccionar ciudad</option>
                {#each cities as c}
                    <option value={c.name}>{c.name}</option>
                {/each}
            </select>
        {:else if stateCode}
            <input
                id="addr-city"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Ciudad"
                bind:value={city}
                {disabled}
            />
        {:else}
            <input
                id="addr-city"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Seleccione primero país y estado"
                bind:value={city}
                {disabled}
            />
        {/if}
    </div>
</div>

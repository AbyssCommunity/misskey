<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<PageWithHeader :actions="headerActions" :tabs="headerTabs">
	<div class="_spacer" style="--MI_SPACER-w: 700px; --MI_SPACER-min: 16px; --MI_SPACER-max: 32px;">
		<SearchMarker path="/admin/external-services" :label="i18n.ts.externalServices" :keywords="['external', 'services', 'thirdparty']" icon="ti ti-link">
			<div class="_gaps_m">
				<SearchMarker v-slot="slotProps">
					<MkFolder :defaultOpen="slotProps.isParentOfTarget">
						<template #label><SearchLabel>Google Analytics</SearchLabel><span class="_beta">{{ i18n.ts.beta }}</span></template>

						<div class="_gaps_m">
							<SearchMarker>
								<MkInput v-model="googleAnalyticsMeasurementId">
									<template #prefix><i class="ti ti-key"></i></template>
									<template #label><SearchLabel>Measurement ID</SearchLabel></template>
								</MkInput>
							</SearchMarker>

							<MkButton primary @click="save_googleAnalytics">Save</MkButton>
						</div>
					</MkFolder>
				</SearchMarker>

				<SearchMarker v-slot="slotProps">
					<MkFolder :defaultOpen="slotProps.isParentOfTarget">
						<template #label><SearchLabel>DeepL Translation</SearchLabel></template>

						<div class="_gaps_m">
							<SearchMarker>
								<MkInput v-model="deeplAuthKey">
									<template #prefix><i class="ti ti-key"></i></template>
									<template #label><SearchLabel>Auth Key</SearchLabel></template>
								</MkInput>
							</SearchMarker>

							<SearchMarker>
								<MkSwitch v-model="deeplIsPro">
									<template #label><SearchLabel>Pro account</SearchLabel></template>
								</MkSwitch>
							</SearchMarker>

							<MkButton primary @click="save_deepl">Save</MkButton>
						</div>
					</MkFolder>
				</SearchMarker>
				
				<MkFolder>
					<template #label>LLM Translation</template>

					<div class="_gaps_m">
						<MkSwitch v-model="LLMTranslatorEnabled">
							<template #label>Enable</template>
							<template #caption>Enable/disable AI-powered(LLM) translation functionality</template>
						</MkSwitch>
						<MkInput v-model="LLMTranslatorBaseUrl" :placeholder="'https://example.com'">
							<template #label>Base URL</template>
							<template #caption>The base URL for openai compatible API</template>
						</MkInput>
						<MkInput v-model="LLMTranslatorApiKey">
							<template #prefix><i class="ti ti-key"></i></template>
							<template #label>API Key</template>
						</MkInput>
						<MkInput v-model="LLMTranslatorModel">
							<template #label>Model Name</template>
							<template #caption>LLM model to use (e.g., gpt-3.5-turbo, text-davinci-003, deepseek-chat)</template>
						</MkInput>
						<MkInput v-model="LLMTranslatorTemperature" type="number">
							<template #label>Temperature</template>
							<template #caption>Sampling temperature (higher = more random/creative)</template>
						</MkInput>
						<MkInput v-model="LLMTranslatorTopP" type="number">
							<template #label>Top P</template>
							<template #caption>Nucleus sampling threshold (0-1, alternative to temperature)</template>
						</MkInput>
						<MkInput v-model="LLMTranslatorMaxTokens" type="number">
							<template #label>Max Tokens</template>
							<template #caption>Maximum length of response in tokens (affects response length)</template>
						</MkInput>
						<MkTextarea v-model="LLMTranslatorSysPrompt">
							<template #label>System Prompt</template>
							<template #caption>Initial system-level instructions for the LLM (can use {text} and {targetLang} as placeholders)<br>Example: "You are a translation specialist. Translate content between languages while preserving technical terms."</template>
						</MkTextarea>
						<MkTextarea v-model="LLMTranslatorUserPrompt">
							<template #label>User Prompt</template>
							<template #caption>Translation instruction template (use {text} for source content and {targetLang} for target language)<br>Example: "Translate this to {targetLang}: {text}"</template>
						</MkTextarea>
						<MkSwitch v-model="LLMTranslatorRedisCacheEnabled">
							<template #label>Redis Cache Enable</template>
							<template #caption>Cache translations by using redis to reduce API calls and costs</template>
						</MkSwitch>
						<MkInput v-model="LLMTranslatorRedisCacheTtl" type="number">
							<template #label>Redis Cache TTL</template>
							<template #caption>Cache expiration time in minutes</template>
						</MkInput>
						<MkButton primary @click="save_LLM">Save</MkButton>
					</div>
				</MkFolder>
			</div>
		</SearchMarker>
	</div>
</PageWithHeader>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import MkInput from '@/components/MkInput.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkButton from '@/components/MkButton.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import * as os from '@/os.js';
import { misskeyApi } from '@/utility/misskey-api.js';
import { fetchInstance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { definePage } from '@/page.js';
import MkFolder from '@/components/MkFolder.vue';

const meta = await misskeyApi('admin/meta');

const deeplAuthKey = ref(meta.deeplAuthKey ?? '');
const deeplIsPro = ref(meta.deeplIsPro);
const googleAnalyticsMeasurementId = ref(meta.googleAnalyticsMeasurementId ?? '');

const LLMTranslatorEnabled = ref(meta.LLMTranslatorEnabled ?? false);
const LLMTranslatorBaseUrl = ref(meta.LLMTranslatorBaseUrl ?? '');
const LLMTranslatorApiKey = ref(meta.LLMTranslatorApiKey ?? '');
const LLMTranslatorModel = ref(meta.LLMTranslatorModel ?? '');
const LLMTranslatorTemperature = ref(meta.LLMTranslatorTemperature);
const LLMTranslatorTopP = ref(meta.LLMTranslatorTopP);
const LLMTranslatorMaxTokens = ref(meta.LLMTranslatorMaxTokens);
const LLMTranslatorSysPrompt = ref(meta.LLMTranslatorSysPrompt ?? '');
const LLMTranslatorUserPrompt = ref(meta.LLMTranslatorUserPrompt ?? '');
const LLMTranslatorRedisCacheEnabled = ref(meta.LLMTranslatorRedisCacheEnabled ?? false);
const LLMTranslatorRedisCacheTtl = ref(meta.LLMTranslatorRedisCacheTtl);

function save_deepl() {
	os.apiWithDialog('admin/update-meta', {
		deeplAuthKey: deeplAuthKey.value,
		deeplIsPro: deeplIsPro.value,
	}).then(() => {
		fetchInstance(true);
	});
}
function save_LLM() {
	os.apiWithDialog('admin/update-meta', {
		enableLLMTranslator: LLMTranslatorEnabled.value,
		LLMTranslatorBaseUrl: LLMTranslatorBaseUrl.value,
		LLMTranslatorApiKey: LLMTranslatorApiKey.value,
		LLMTranslatorModel: LLMTranslatorModel.value,
		LLMTranslatorTemperature: LLMTranslatorTemperature.value,
		LLMTranslatorTopP: LLMTranslatorTopP.value,
		LLMTranslatorMaxTokens: LLMTranslatorMaxTokens.value,
		LLMTranslatorSysPrompt: LLMTranslatorSysPrompt.value,
		LLMTranslatorUserPrompt: LLMTranslatorUserPrompt.value,
		enableLLMTranslatorRedisCache: LLMTranslatorRedisCacheEnabled.value,
		LLMTranslatorRedisCacheTtl: LLMTranslatorRedisCacheTtl.value,
	}).then(() => {
		fetchInstance(true);
	});
}


function save_googleAnalytics() {
	os.apiWithDialog('admin/update-meta', {
		googleAnalyticsMeasurementId: googleAnalyticsMeasurementId.value,
	}).then(() => {
		fetchInstance(true);
	});
}

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePage(() => ({
	title: i18n.ts.externalServices,
	icon: 'ti ti-link',
}));
</script>

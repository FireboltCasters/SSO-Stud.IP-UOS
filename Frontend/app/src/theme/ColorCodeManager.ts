import React from 'react';
import { NativeBaseProvider, ColorMode } from 'native-base';
import type { StorageManager } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ColorCodeManager{
	static VALUE_THEME_DARK: ColorMode = 'dark';
	static VALUE_THEME_LIGHT: ColorMode = 'light';
	static STORAGE_THEME_KEY = "@my-app-color-mode";

	static async getColorModeFromStorage(): Promise<ColorMode>{
		try {
			let val = await AsyncStorage.getItem(ColorCodeManager.STORAGE_THEME_KEY);
			return val === ColorCodeManager.VALUE_THEME_DARK ? ColorCodeManager.VALUE_THEME_DARK : ColorCodeManager.VALUE_THEME_LIGHT;
		} catch (e) {
			console.log(e);
			return ColorCodeManager.VALUE_THEME_LIGHT;
		}
	}

	static async setColorModeToStorage(value: ColorMode){
		try {
			await AsyncStorage.setItem(ColorCodeManager.STORAGE_THEME_KEY, value);
		} catch (e) {
			console.log(e);
		}
	}

	static getManager(): StorageManager{
		return {
			get: async () => {
				return await ColorCodeManager.getColorModeFromStorage();
			},
			set: async (value: ColorMode) => {
				await ColorCodeManager.setColorModeToStorage(value);
			},
		};
	}
}

window.ModernTheme = Blockly.Theme.defineTheme('modernTheme', {
    name: 'modernTheme',
    base: Blockly.Themes.Classic,
    blockStyles: {
        colour_blocks: { 
            colourPrimary: '#D35400', 
            colourSecondary: '#E67E22', 
            colourTertiary: '#BA4A00' 
        },
        list_blocks: { 
            colourPrimary: '#E74C3C', 
            colourSecondary: '#EC7063', 
            colourTertiary: '#C0392B' 
        },
        logic_blocks: { 
            colourPrimary: '#5ba58c', 
            colourSecondary: '#7DCEA0', 
            colourTertiary: '#45896F' 
        },
        loop_blocks: { 
            colourPrimary: '#E63946', 
            colourSecondary: '#F1948A', 
            colourTertiary: '#C0392B' 
        },
        math_blocks: { 
            colourPrimary: '#F39C12', 
            colourSecondary: '#F8C471', 
            colourTertiary: '#D68910' 
        },
        procedure_blocks: { 
            colourPrimary: '#8E44AD', 
            colourSecondary: '#A569BD', 
            colourTertiary: '#6C3483' 
        },
        text_blocks: { 
            colourPrimary: '#5ba58c', 
            colourSecondary: '#82E0AA', 
            colourTertiary: '#45896F' 
        },
        variable_blocks: { 
            colourPrimary: '#FF8C42', 
            colourSecondary: '#FFAA70', 
            colourTertiary: '#E67325' 
        },
        variableDynamic_blocks: { 
            colourPrimary: '#FF8C42', 
            colourSecondary: '#FFAA70', 
            colourTertiary: '#E67325' 
        },
        hat_blocks: { 
            colourPrimary: '#FF6B35', 
            colourSecondary: '#FF8C60', 
            colourTertiary: '#E64A1A', 
            hat: 'cap' 
        },
    },
    categoryStyles: {
        colour_category: { colour: '#D35400' },
        list_category: { colour: '#E74C3C' },
        logic_category: { colour: '#5ba58c' },
        loop_category: { colour: '#E63946' },
        math_category: { colour: '#F39C12' },
        procedure_category: { colour: '#8E44AD' },
        text_category: { colour: '#5ba58c' },
        variable_category: { colour: '#FF8C42' },
        variable_dynamic_category: { colour: '#FF8C42' },
    },
    componentStyles: {
        workspaceBackgroundColour: '#fafafa',
        toolboxBackgroundColour: '#ffffff',
        toolboxForegroundColour: '#2c3e50',
        flyoutBackgroundColour: '#f8f9fa',
        flyoutForegroundColour: '#34495e',
        flyoutOpacity: 0.6,
        scrollbarColour: '#6a4500',
        insertionMarkerColour: '#FF6B35',
        insertionMarkerOpacity: 0.4,
        scrollbarOpacity: 0.5,
        cursorColour: '#E63946',
        selectedGlowColour: '#FFA500',
        selectedGlowOpacity: 0.3,
        replacementGlowColour: '#FFD700',
        replacementGlowOpacity: 0.3,
    },
    startHats: true,
});
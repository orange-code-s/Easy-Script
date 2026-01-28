window.toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Events',
      cssConfig: { row: 'RowEV Row' },
      contents: [
        { kind: 'block', type: 'when_start' },
        { kind: 'block', type: 'when_closed' },
        { kind: 'block', type: 'when_key_pressed', inputs: { 'KEY': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'space' } } } },
        { kind: 'block', type: 'when_mouse_clicked' },
        { kind: 'block', type: 'broadcast', inputs: { 'MSG': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'message1' } } } },
        { kind: 'block', type: 'when_receive', inputs: { 'MSG': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'message1' } } } }
      ]
    },
    {
      kind: 'category',
      name: 'Control',
      cssConfig: { row: 'RowCO Row' },
      contents: [
        { kind: 'block', type: 'forever' },
        { kind: 'block', type: 'wait_seconds', inputs: { 'SECS': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } } } },
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
        { kind: 'block', type: 'controls_repeat_ext', inputs: { 'TIMES': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } } } },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for', inputs: {
            'FROM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } },
            'TO': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } },
            'BY': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } }
        }},
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' }
      ]
    },
    {
      kind: 'category',
      name: 'Motion',
      cssConfig: { row: 'RowMO Row' },
      contents: [
        { kind: 'block', type: 'move_forward', inputs: { 'STEPS': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } } } },
        { kind: 'block', type: 'turn', inputs: { 'ANGLE': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 15 } } } },
        { kind: 'block', type: 'go_to', inputs: {
            'X': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 0 } },
            'Y': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 0 } }
        }},
        { kind: 'block', type: 'point_direction', inputs: { 'DIR': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 90 } } } },
        { kind: 'block', type: 'change_x_by', inputs: { 'DX': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } } } },
        { kind: 'block', type: 'change_y_by', inputs: { 'DY': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } } } },
        { kind: 'block', type: 'get_x' },
        { kind: 'block', type: 'get_y' },
        { kind: 'block', type: 'get_direction' },
        { kind: 'block', type: 'angle_value' }
      ]
    },
    {
      kind: 'category',
      name: 'Canvas',
      cssConfig: { row: 'RowCA Row' },
      contents: [
        { kind: 'block', type: 'clear_canvas' },
        { kind: 'block', type: 'set_pen' },
        { kind: 'block', type: 'set_pen_size', inputs: { 'SIZE': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 2 } } } },
        { kind: 'block', type: 'change_pen_size', inputs: { 'DSIZE': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } } } }
      ]
    },
    {
      kind: 'category',
      name: 'Sensing',
      cssConfig: { row: 'RowSN Row' },
      contents: [
        { kind: 'block', type: 'is_key', inputs: { 'KEY': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'a' } } } },
        { kind: 'block', type: 'mouse_button_state' },
        { kind: 'block', type: 'mouse_x' },
        { kind: 'block', type: 'mouse_y' }
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      cssConfig: { row: 'RowLO Row' },
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' }
      ]
    },
    {
      kind: 'category',
      name: 'Math',
      cssConfig: { row: 'RowMA Row' },
      contents: [
        { kind: 'block', type: 'math_number', fields: { 'NUM': 123 } },
        { kind: 'block', type: 'math_arithmetic', inputs: {
            'A': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } },
            'B': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } }
        }},
        { kind: 'block', type: 'math_single', inputs: { 'NUM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 9 } } } },
        { kind: 'block', type: 'math_trig', inputs: { 'NUM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 45 } } } },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property', inputs: { 'NUMBER_TO_CHECK': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 0 } } } },
        { kind: 'block', type: 'math_round', inputs: { 'NUM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 3.1 } } } },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo', inputs: {
            'DIVIDEND': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 64 } },
            'DIVISOR': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 10 } }
        }},
        { kind: 'block', type: 'math_constrain', inputs: {
            'VALUE': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 50 } },
            'LOW': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } },
            'HIGH': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 100 } }
        }},
        { kind: 'block', type: 'math_random_int', inputs: {
            'FROM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } },
            'TO': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 100 } }
        }},
        { kind: 'block', type: 'math_random_float' },
        { kind: 'block', type: 'math_atan2', inputs: {
            'X': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } },
            'Y': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 1 } }
        }}
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      cssConfig: { row: 'RowTE Row' },
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append', inputs: { 'TEXT': { kind: 'shadow', type: 'text' } } },
        { kind: 'block', type: 'text_length', inputs: { 'VALUE': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } },
        { kind: 'block', type: 'text_isEmpty', inputs: { 'VALUE': { kind: 'shadow', type: 'text', fields: { 'TEXT': '' } } } },
        { kind: 'block', type: 'text_indexOf', inputs: { 'VALUE': { kind: 'block', type: 'variables_get' }, 'FIND': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } },
        { kind: 'block', type: 'text_charAt', inputs: { 'VALUE': { kind: 'block', type: 'variables_get' } } },
        { kind: 'block', type: 'text_getSubstring', inputs: { 'STRING': { kind: 'block', type: 'variables_get' } } },
        { kind: 'block', type: 'text_changeCase', inputs: { 'TEXT': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } },
        { kind: 'block', type: 'text_trim', inputs: { 'TEXT': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } },
        { kind: 'block', type: 'text_print', inputs: { 'TEXT': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } },
        { kind: 'block', type: 'text_prompt_ext', inputs: { 'TEXT': { kind: 'shadow', type: 'text', fields: { 'TEXT': 'abc' } } } }
      ]
    },
    {
      kind: 'category',
      name: 'Lists',
      cssConfig: { row: 'RowLI Row' },
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_create_empty' },
        { kind: 'block', type: 'lists_repeat', inputs: { 'NUM': { kind: 'shadow', type: 'math_number', fields: { 'NUM': 5 } } } },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
        { kind: 'block', type: 'lists_getSublist' },
        { kind: 'block', type: 'lists_split' },
        { kind: 'block', type: 'lists_sort' }
      ]
    },
    {
      kind: 'category',
      name: 'Color',
      cssConfig: { row: 'RowCL Row' },
      contents: [
        { kind: 'block', type: 'set_pen_color', inputs: { 'COLOR': { kind: 'shadow', type: 'colour_value' } } },
        { kind: 'block', type: 'colour_value' }
      ]
    },
    {
      kind: 'category',
      name: 'System',
      cssConfig: { row: 'RowSY Row' },
      contents: [
        { kind: 'block', type: 'delta_time' },
        { kind: 'block', type: 'fps' },
        { kind: 'block', type: 'screen_width' },
        { kind: 'block', type: 'screen_height' }
      ]
    },
    { kind: 'sep' },
    { kind: 'category', name: 'Variables', cssConfig: { row: 'RowVA Row' }, custom: 'VARIABLE' },
    { kind: 'category', name: 'Functions', cssConfig: { row: 'RowFU Row' }, custom: 'PROCEDURE' }
  ]
};
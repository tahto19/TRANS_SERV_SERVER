RESOLUTION = 30
INTERPOLATION_PAD_DISTANCE = 'auto'
INTERPOLATION_PAD_BUFFER = 500
INTERPOLATION_EXTENT_LAYER = 'boundary'
ZOOMPADDING = 0.04
EXPORT_DPI = 120

BOUNDARY_STYLE = {
    'name': '',
    'opacity': 0.7,
    'style': 'solid', # 'solid', 'dash', 'dot', 'dashdot', 'dashdotdot'
    'fill': {
        'color': '0,0,0,0',
        'opacity': 0
    },
    'outline': {
        'color': '#ffffff',
        'width': 1,
    },
}

BOUNDARY_STYLE_BY_TENANT = {
    '': {
        'name': '',
        'opacity': 0.7,
        'style': 'solid', # 'solid', 'dash', 'dot', 'dashdot', 'dashdotdot'
        'fill': {
            'color': '0,0,0,0',
            'opacity': 0
        },
        'outline': {
            'color': 'white',
            'width': 1,
        },
    }
}

POINTS_STYLE = {
    'shape': 'circle', # 'circle', 'square', 'diamond', 'triangle', 'star', 'cross', 'x'
    'size': 2,
    'opacity': 1,
    'fill': {
        'color': '25,5,225,255',
    },
    'outline': {
        'color': '#000000',
        'width': 0.3
    },
    'label': {
        'field': 'name',
        'color': '#000000',
        'halocolor': '#ffffff',
        'size': 9,
        'xOffset': 1,
        'yOffset': -0.5
    }
}

LEGEND_STYLE = {
    'position' : 'top-left', # 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    'spacing' : 10,
    'value-decimal-threshold' : 10,
    'font-family': 'Arial, sans-serif',
    'font-size': '12pt',
    'title-font-size': '12pt',
    'subtitle-font-size': '10pt',
    'background-color': '#fff',
    'font-color': '#000',
    'roundness' : 25,
    'padding': 10,
    'dot-width': 20,
    'dot-height': 15,
    
}


TO_BE_FETCHED = {
    'Max_Temperature' : {
        'sensor': ['Air Temperature (2m)', 'Air Temperature (3m)', 'Air Temperature (6m)'],
        'key': 'max',
        'colorPalette': 'max-t',
        'unit': '°C',
        'title' : 'Maximum Temperature'
    },
    'Min_Temperature' : {
        'sensor': ['Air Temperature (2m)', 'Air Temperature (3m)', 'Air Temperature (6m)'],
        'key': 'min',
        'colorPalette': 'min-t',
        'unit': '°C',
        'title' : 'Minimum Temperature '
    },
    'Rainfall' : {
        'sensor': ['Rainfall (0m)', 'Rainfall (2m)'],
        'key': 'sum',
        'colorPalette': 'r',
        'unit': 'mm',
        'title' : 'Rainfall'
    }
}

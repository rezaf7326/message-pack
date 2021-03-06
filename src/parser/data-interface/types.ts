import { Formats } from "./formats";
const { 
    str_8, str_16, str_32,
    bool_false, bool_true,
    uint_8, uint_16, uint_32, uint_64,
    int_8, int_16, int_32, int_64, float_32, float_64, 
    nil,
    array_16, array_32, 
    map_16, map_32,
} = Formats;


const type_str_formats = [ str_8, str_16, str_32 ];
const type_bool_formats = [ bool_false, bool_true ];
const type_null_formats = [ nil ];
const type_array_formats = [ array_16, array_32 ];
const type_map_formats = [ map_16, map_32 ];
const type_number_formats = [
    uint_8, uint_16, uint_32, uint_64,
    int_8, int_16, int_32, int_64, 
    float_32, float_64,
];


type SupportedTypes = Number | number | String | string | Boolean | boolean | any [] | Map<any, any> ; // + null
enum TypesEnum {
    "Number", "String", "Boolean", "Null", "Array", "Map"
}

export {
    SupportedTypes,
    TypesEnum,
    type_str_formats,
    type_bool_formats,
    type_null_formats,
    type_number_formats,
    type_array_formats,
    type_map_formats
};

import {ChangeEventHandler, FC} from "react";

type SearchInputType = {
    placeholder: string;
    value: string;
    onChange:  ChangeEventHandler<HTMLInputElement>;
}

const SearchInput:FC<SearchInputType> = ({placeholder, value, onChange}) => {
    return (
        <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className='w-72 px-4 py-2 text-white font-bold text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-700 focus:border-transparent bg-black/30 backdrop-invert backdrop-opacity-20'

        />
    );
};

export default SearchInput;
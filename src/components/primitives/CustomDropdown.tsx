import {Button, Dropdown} from "@tremor/react";
import {DropdownProps} from "@tremor/react/dist/esm/components/input-elements/Dropdown/Dropdown";
import {PropsWithChildren} from "react";

type CustomDropdownProps = DropdownProps & { loading?: boolean, disabled?: boolean }

const CustomDropdown = ({
                            loading = false,
                            disabled = false,
                            children,
                            ...props
                        }: PropsWithChildren<CustomDropdownProps>) => {

    if (loading) {
        return <Button loading={true} variant={'secondary'}/>
    }

    if (disabled) {
        return <Button disabled={true} variant={'secondary'}/>
    }

    return (
        <Dropdown {...props}>
            {children}
        </Dropdown>
    )
}

export default CustomDropdown
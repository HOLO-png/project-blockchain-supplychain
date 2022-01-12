import { css } from 'styled-components';

export const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    transition: display 0.5s ease;
`;

export const loaderAction = (user, setLoading) => {
    return setTimeout(() => {
        if (user) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, 500);
};

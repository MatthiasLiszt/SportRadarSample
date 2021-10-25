import React from 'react';
import { render } from 'react-testing-library';

import Data from '../index';

describe('<Data />', () => {
  it('should render its heading', () => {
    const {
      container: { firstChild },
    } = render(<Data />);

    expect(firstChild).toMatchSnapshot();
  });
});

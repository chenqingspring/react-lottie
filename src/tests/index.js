import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactLottie from '../index';
import pinjump from '../stories/pinjump.json';
import beatingHeart from '../stories/beating-heart.json';

const { describe, it } = global;
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: pinjump,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

describe('react-lottie', () => {
  describe('props', () => {
    describe('isClickToPauseDisabled', () => {
      it('should prevent handleClickToPause from being called when true', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const spy = sinon.stub();

        component.instance().handleClickToPause = spy;
        component.instance().forceUpdate();
        component.find('div').at(0).simulate('click');

        expect(spy.callCount).to.equal(1);

        spy.reset();
        component.setProps({ isClickToPauseDisabled: true });
        component.find('div').at(0).simulate('click');

        expect(spy.callCount).to.equal(0);
      });
    });

    describe('ariaRole, ariaLabel, and title', () => {
      it('should set the aria role correctly', () => {
        const component = shallow(
          <ReactLottie
            options={defaultOptions}
            ariaRole="test"
            ariaLabel="testlabel"
            title="title"
          />
        );

        expect(component.find('div').prop('role')).to.equal('test');
        expect(component.find('div').prop('aria-label')).to.equal('testlabel');
        expect(component.find('div').prop('title')).to.equal('title');
      });
    });

    describe('height and width', () => {
      it('should set the inline styles correctly', () => {
        const component = shallow(
          <ReactLottie
            options={defaultOptions}
            height={199}
            width={188}
          />
        );

        expect(component.find('div').prop('style').height).to.equal('199px');
        expect(component.find('div').prop('style').width).to.equal('188px');
      });
    });
  });

  describe('when props change', () => {
    it('should change the animation that is being played', () => {
      const component = mount(<ReactLottie options={defaultOptions} />);

      expect(component.instance().anim.animationData).to.equal(pinjump);

      component.setProps({
        options: {
          ...defaultOptions,
          animationData: beatingHeart,
        },
      });

      expect(component.instance().anim.animationData).to.equal(beatingHeart);
    });
  });

  describe('component lifecycle', () => {
    describe('componentDidMount', () => {
      it('should register events', () => {
        const registerEventsSpy = sinon.stub();
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().registerEvents = registerEventsSpy;
        component.update();

        component.instance().componentDidMount();

        expect(registerEventsSpy.callCount).to.equal(1);
      });

      it('should load the animation', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const animation = component.instance().anim;

        expect(animation.animationData).to.equal(pinjump);
      });
    });

    describe('componentWillUpdate', () => {
      it('should register events when animationData changes', () => {
        const registerEventsSpy = sinon.stub();
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().registerEvents = registerEventsSpy;
        component.update();

        component.instance().componentWillUpdate({
          options: {
            ...defaultOptions,
            animationData: beatingHeart,
          },
        });

        expect(registerEventsSpy.callCount).to.equal(1);
      });
    });

    describe('componentDidUnmount', () => {
      it('should de-register events', () => {
        const spy = sinon.stub();
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().deRegisterEvents = spy;
        component.update();
        component.unmount();

        expect(spy.callCount).to.equal(1);
      });

      it('should destroy the animation', () => {
        const spy = sinon.stub();
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().anim = {
          destroy: spy,
        };

        component.unmount();

        expect(spy.callCount).to.equal(1);
      });
    });
  });
});

import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import lottie from 'lottie-web';
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
        act(() => {
          component.instance().forceUpdate();
        });
        component.update();
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

    describe('margin', () => {
      it('defaults to centring and accepts a custom value (#107)', () => {
        const component = shallow(<ReactLottie options={defaultOptions} />);
        expect(component.find('div').prop('style').margin).to.equal('0 auto');

        component.setProps({ margin: '10px auto' });
        expect(component.find('div').prop('style').margin).to.equal('10px auto');

        component.setProps({ margin: 20 });
        expect(component.find('div').prop('style').margin).to.equal('20px');
      });

      it('still lets style override margin', () => {
        const component = shallow(
          <ReactLottie options={defaultOptions} margin="0 auto" style={{ margin: 0 }} />
        );

        expect(component.find('div').prop('style').margin).to.equal(0);
      });
    });

    describe('tabIndex', () => {
      it('defaults to 0 and can be removed from the tab order', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        expect(component.find('div').at(0).prop('tabIndex')).to.equal(0);

        component.setProps({ tabIndex: -1 });
        expect(component.find('div').at(0).prop('tabIndex')).to.equal(-1);
        component.unmount();
      });
    });

    describe('colorFilters', () => {
      const filters = [{ keypath: 'Pin 1.Shape 2.Fill 1', color: '#00ff00' }];
      const getFill = data => data.layers
        .find(layer => layer.nm === 'Pin 1')
        .shapes.find(shape => shape.nm === 'Shape 2')
        .it.find(item => item.nm === 'Fill 1')
        .c.k;

      it('recolors animationData and leaves the source untouched', () => {
        const original = getFill(pinjump);
        const component = mount(
          <ReactLottie options={defaultOptions} colorFilters={filters} />
        );

        expect(getFill(component.instance().anim.animationData)).to.deep.equal([0, 1, 0, 1]);
        expect(getFill(pinjump)).to.deep.equal(original);
        expect(component.html()).to.contain('rgb(0,255,0)');
        component.unmount();
      });

      it('reloads when the filters change and keeps a paused frame', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const first = component.instance().anim;

        component.instance().goToAndStop(12, true);
        expect(first.currentFrame).to.equal(12);

        component.setProps({ colorFilters: filters });
        const second = component.instance().anim;

        expect(second).to.not.equal(first);
        expect(second.currentFrame).to.equal(12);
        expect(second.isPaused).to.equal(true);
        expect(getFill(second.animationData)).to.deep.equal([0, 1, 0, 1]);
        component.unmount();
      });

      it('keeps a playing animation running when the filters change', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().play();
        component.setProps({ colorFilters: filters });

        expect(component.instance().anim.isPaused).to.equal(false);
        component.unmount();
      });

      it('does not reload when an equal filter array is re-created', () => {
        const component = mount(
          <ReactLottie options={defaultOptions} colorFilters={filters} />
        );
        const animation = component.instance().anim;

        component.setProps({ colorFilters: filters.map(filter => ({ ...filter })) });
        expect(component.instance().anim).to.equal(animation);
        component.unmount();
      });

      it('restores the original colors when the filters are removed', () => {
        const original = getFill(pinjump);
        const component = mount(
          <ReactLottie options={defaultOptions} colorFilters={filters} />
        );

        component.setProps({ colorFilters: [] });
        expect(getFill(component.instance().anim.animationData)).to.deep.equal(original);
        component.unmount();
      });
    });

    describe('animationData validation', () => {
      it('accepts a namespace import by using its default export (#24, #65)', () => {
        const namespace = { default: pinjump };
        const component = mount(
          <ReactLottie options={{ ...defaultOptions, animationData: namespace }} />
        );

        expect(component.instance().anim.animationData).to.equal(pinjump);
        expect(component.html()).to.contain('<svg');
        component.unmount();
      });

      it('clones a frozen animation object before handing it to lottie-web', () => {
        const frozen = Object.freeze(JSON.parse(JSON.stringify(pinjump)));
        const component = mount(
          <ReactLottie options={{ ...defaultOptions, animationData: frozen }} />
        );

        expect(component.instance().anim.animationData).to.not.equal(frozen);
        expect(component.instance().anim.animationData.layers)
          .to.have.length(pinjump.layers.length);
        component.unmount();
      });

      it('explains that a string or URL belongs in options.path (#44, #106)', () => {
        ['a.json', 'https://someurl.com/animationData.json'].forEach((animationData) => {
          expect(() => mount(
            <ReactLottie options={{ ...defaultOptions, animationData }} />
          )).to.throw(/options\.path/);
        });
      });

      it('explains that animationData or path is required', () => {
        expect(() => mount(
          <ReactLottie options={{ loop: true }} />
        )).to.throw(/animationData.*path/);
      });
    });

    describe('as', () => {
      it('renders a div by default', () => {
        const component = shallow(<ReactLottie options={defaultOptions} />);
        expect(component.find('div')).to.have.length(1);
      });

      it('renders the requested element instead of a div', () => {
        const component = mount(
          <ReactLottie options={defaultOptions} as="span" />
        );

        expect(component.find('span')).to.have.length(1);
        expect(component.find('div')).to.have.length(0);
        expect(component.instance().el.tagName).to.equal('SPAN');
        component.unmount();
      });

      it('can be nested in a paragraph without invalid DOM nesting (#73)', () => {
        const component = mount(
          <p><ReactLottie options={defaultOptions} as="span" /></p>
        );

        expect(component.find('p div')).to.have.length(0);
        component.unmount();
      });

      it('supports a component that forwards its ref', () => {
        const Span = React.forwardRef(function Span(props, ref) {
          return <span ref={ref} {...props} />;
        });
        const component = mount(
          <ReactLottie options={defaultOptions} as={Span} />
        );

        expect(component.find('span')).to.have.length(1);
        expect(component.instance().el.tagName).to.equal('SPAN');
        component.unmount();
      });

      it('rebinds the animation to the new element and keeps the frame', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const first = component.instance().anim;
        const destroy = sinon.spy(first, 'destroy');

        component.instance().goToAndStop(12, true);
        component.setProps({ as: 'span' });

        expect(destroy.callCount).to.equal(1);
        expect(component.instance().anim).to.not.equal(first);
        expect(component.instance().el.tagName).to.equal('SPAN');
        expect(component.instance().anim.currentFrame).to.equal(12);
        expect(component.instance().anim.isPaused).to.equal(true);
        component.unmount();
      });
    });

    describe('renderer', () => {
      it('defaults to svg and passes an override to lottie-web', () => {
        const svg = mount(<ReactLottie options={defaultOptions} />);
        expect(svg.instance().options.renderer).to.equal('svg');
        svg.unmount();

        const loadAnimation = sinon.stub(lottie, 'loadAnimation').returns({
          addEventListener: sinon.stub(),
          removeEventListener: sinon.stub(),
          setSpeed: sinon.stub(),
          setDirection: sinon.stub(),
          setSubframe: sinon.stub(),
          stop: sinon.stub(),
          pause: sinon.stub(),
          destroy: sinon.stub(),
        });
        const component = shallow(
          <ReactLottie options={{ ...defaultOptions, renderer: 'canvas' }} />
        );

        component.instance().componentDidMount();
        expect(loadAnimation.firstCall.args[0].renderer).to.equal('canvas');
        loadAnimation.restore();
      });
    });

    describe('locationHref (#111)', () => {
      const stubAnimation = () => ({
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        setSpeed: sinon.stub(),
        setDirection: sinon.stub(),
        setSubframe: sinon.stub(),
        stop: sinon.stub(),
        pause: sinon.stub(),
        destroy: sinon.stub(),
      });

      it('applies options.locationHref before the animation is generated', () => {
        const setLocationHref = sinon.stub(lottie, 'setLocationHref');
        const loadAnimation = sinon.stub(lottie, 'loadAnimation').returns(stubAnimation());
        const component = shallow(
          <ReactLottie
            options={{ ...defaultOptions, locationHref: 'https://example.com/app/' }}
          />
        );

        component.instance().componentDidMount();

        expect(setLocationHref.calledWith('https://example.com/app/')).to.equal(true);
        expect(setLocationHref.calledBefore(loadAnimation)).to.equal(true);

        setLocationHref.restore();
        loadAnimation.restore();
      });

      it('leaves lottie-web alone when no locationHref is given', () => {
        const setLocationHref = sinon.stub(lottie, 'setLocationHref');
        const component = mount(<ReactLottie options={defaultOptions} />);

        expect(setLocationHref.callCount).to.equal(0);

        component.unmount();
        setLocationHref.restore();
      });

      it('regenerates the animation when locationHref changes', () => {
        const setLocationHref = sinon.spy(lottie, 'setLocationHref');
        const component = mount(
          <ReactLottie options={{ ...defaultOptions, locationHref: 'https://example.com/a/' }} />
        );

        component.setProps({
          options: { ...defaultOptions, locationHref: 'https://example.com/b/' },
        });

        expect(setLocationHref.callCount).to.equal(2);
        expect(setLocationHref.lastCall.args[0]).to.equal('https://example.com/b/');

        component.unmount();
        setLocationHref.restore();
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

    it('should reload the animation when the remote path changes', () => {
      const createAnimation = () => ({
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        setSpeed: sinon.stub(),
        setDirection: sinon.stub(),
        setSubframe: sinon.stub(),
        stop: sinon.stub(),
        pause: sinon.stub(),
        play: sinon.stub(),
        playSegments: sinon.stub(),
        destroy: sinon.stub(),
      });
      const firstAnimation = createAnimation();
      const secondAnimation = createAnimation();
      const loadAnimation = sinon.stub(lottie, 'loadAnimation');
      loadAnimation.onFirstCall().returns(firstAnimation);
      loadAnimation.onSecondCall().returns(secondAnimation);

      const component = mount(
        <ReactLottie options={{ loop: true, autoplay: true, path: 'a.json' }} />
      );

      expect(component.instance().anim).to.equal(firstAnimation);

      component.setProps({ options: { loop: true, autoplay: true, path: 'b.json' } });

      expect(loadAnimation.callCount).to.equal(2);
      expect(loadAnimation.secondCall.args[0].path).to.equal('b.json');
      /* No stale `animationData` may be handed to lottie-web; it would take
         precedence over the new path and keep the old animation on screen. */
      expect(loadAnimation.secondCall.args[0].animationData).to.equal(undefined);
      /* The component has to play the newly loaded animation, not the one it
         destroyed. */
      expect(firstAnimation.destroy.callCount).to.equal(1);
      expect(component.instance().anim).to.equal(secondAnimation);

      component.unmount();
      loadAnimation.restore();
    });

    it('keeps a playing animation running when an unrelated prop changes (#43)', () => {
      const component = mount(<ReactLottie options={defaultOptions} />);
      const animation = component.instance().anim;

      expect(animation.isPaused).to.equal(false);

      component.setProps({ width: 320 });
      expect(animation.isPaused).to.equal(false);

      component.unmount();
    });

    it('does not start an animation created with autoplay: false (#32)', () => {
      const options = { ...defaultOptions, autoplay: false };
      const component = mount(<ReactLottie options={options} />);
      const animation = component.instance().anim;

      expect(animation.isPaused).to.equal(true);

      component.setProps({ width: 320 });
      expect(animation.isPaused).to.equal(true);

      component.setProps({ options: { ...options } });
      expect(component.instance().anim).to.equal(animation);
      expect(animation.isPaused).to.equal(true);

      component.unmount();
    });

    it('does not restart the animation when an equal segments array is re-created', () => {
      const component = mount(
        <ReactLottie options={defaultOptions} segments={[0, 30]} />
      );
      const spy = sinon.stub();
      component.instance().anim.playSegments = spy;

      component.setProps({ segments: [0, 30] });
      expect(spy.callCount).to.equal(0);

      component.setProps({ segments: [0, 60] });
      expect(spy.callCount).to.equal(1);
      expect(spy.calledWith([0, 60], true)).to.equal(true);

      component.unmount();
    });

    it('applies the segments prop on mount', () => {
      const component = mount(
        <ReactLottie options={defaultOptions} segments={[10, 30]} />
      );
      const animation = component.instance().anim;

      expect(animation.firstFrame).to.equal(10);
      expect(animation.totalFrames).to.equal(20);

      component.unmount();
    });

    it('keeps a mount-time segment paused when autoplay is false', () => {
      const component = mount(
        <ReactLottie
          options={{ ...defaultOptions, autoplay: false }}
          segments={[10, 30]}
        />
      );
      const animation = component.instance().anim;

      expect(animation.firstFrame).to.equal(10);
      expect(animation.isPaused).to.equal(true);

      component.unmount();
    });
  });

  describe('hover playback', () => {
    const hoverOptions = {
      ...defaultOptions,
      autoplay: false,
    };

    it('plays on enter and reverses from the current frame on leave', () => {
      const component = mount(
        <ReactLottie options={hoverOptions} isStopped direction={1} />
      );
      const animation = component.instance().anim;

      expect(animation.isPaused).to.equal(true);

      component.setProps({ isStopped: false });
      expect(animation.isPaused).to.equal(false);
      expect(animation.playDirection).to.equal(1);

      component.setProps({ direction: -1 });
      expect(animation.isPaused).to.equal(false);
      expect(animation.playDirection).to.equal(-1);

      component.setProps({ direction: 1 });
      expect(animation.isPaused).to.equal(false);
      expect(animation.playDirection).to.equal(1);

      component.unmount();
    });

    it('applies the initial playback props on mount', () => {
      const reversed = mount(<ReactLottie options={hoverOptions} direction={-1} />);
      expect(reversed.instance().anim.playDirection).to.equal(-1);
      reversed.unmount();

      const stopped = mount(
        <ReactLottie
          options={{ ...hoverOptions, autoplay: true }}
          isStopped
        />
      );
      expect(stopped.instance().anim.isPaused).to.equal(true);
      stopped.unmount();

      const paused = mount(
        <ReactLottie
          options={{ ...hoverOptions, autoplay: true }}
          isPaused
        />
      );
      expect(paused.instance().anim.isPaused).to.equal(true);
      paused.unmount();
    });

    it('registers eventListeners on the animation, not on the DOM node', () => {
      let calls = 0;
      const component = mount(
        <ReactLottie
          options={hoverOptions}
          eventListeners={[{
            eventName: 'complete',
            callback: () => { calls += 1; },
          }]}
        />
      );

      component.find('div').at(0).simulate('mouseover');
      expect(calls).to.equal(0);

      component.instance().anim.trigger('complete');
      expect(calls).to.equal(1);

      component.unmount();
    });
  });

  describe('lazy loading (#137)', () => {
    it('mounts and unmounts when eventListeners is null', () => {
      const component = mount(
        <ReactLottie options={defaultOptions} eventListeners={null} />
      );

      expect(component.instance().anim).to.not.equal(undefined);
      expect(() => component.unmount()).to.not.throw();
    });

    it('tolerates eventListeners becoming null before a reload', () => {
      const component = mount(
        <ReactLottie
          options={defaultOptions}
          eventListeners={[{ eventName: 'complete', callback: () => {} }]}
        />
      );

      expect(() => component.setProps({
        eventListeners: null,
        options: { ...defaultOptions, animationData: beatingHeart },
      })).to.not.throw();
      expect(component.instance().anim.animationData).to.equal(beatingHeart);

      expect(() => component.unmount()).to.not.throw();
    });

    it('ignores another non-array value instead of throwing', () => {
      const component = mount(
        <ReactLottie options={defaultOptions} eventListeners={{}} />
      );

      expect(() => component.unmount()).to.not.throw();
    });
  });

  describe('component lifecycle', () => {
    // Issue #119: React 16.3 deprecated the will* lifecycles and React 17 only
    // honors the UNSAFE_ spelling. The data/path reload runs in
    // componentDidUpdate instead, so neither name should reappear.
    describe('deprecated lifecycles (#119)', () => {
      it('does not use the lifecycles React 17 removed', () => {
        [
          'componentWillMount',
          'componentWillReceiveProps',
          'componentWillUpdate',
        ].forEach((name) => {
          expect(ReactLottie.prototype[name]).to.equal(undefined);
          expect(ReactLottie.prototype[`UNSAFE_${name}`]).to.equal(undefined);
        });
        expect(ReactLottie.prototype.componentDidUpdate).to.be.a('function');
      });
    });

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

    describe('componentDidUpdate', () => {
      it('should register events when animationData changes', () => {
        const registerEventsSpy = sinon.stub();
        const component = mount(<ReactLottie options={defaultOptions} />);

        component.instance().registerEvents = registerEventsSpy;
        component.setProps({
          options: {
            ...defaultOptions,
            animationData: beatingHeart,
          },
        });

        expect(registerEventsSpy.callCount).to.equal(1);
      });

      it('should not recreate the animation when options are unchanged', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const original = component.instance().anim;

        component.setProps({ width: 320 });

        expect(component.instance().anim).to.equal(original);
        component.unmount();
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

      it('should not throw when the animation is already gone', () => {
        const component = shallow(<ReactLottie options={defaultOptions} />);
        component.instance().anim = null;

        expect(() => component.instance().destroy()).to.not.throw();
      });
    });

    describe('playSegments', () => {
      it('should force the new segments to play when already running', () => {
        const spy = sinon.stub();
        const component = mount(
          <ReactLottie options={defaultOptions} segments={[0, 30]} />
        );

        component.instance().anim.playSegments = spy;
        component.instance().playSegments();

        expect(spy.calledWith([0, 30], true)).to.equal(true);
      });
    });

    describe('imperative playback', () => {
      it('pause() pauses a playing animation even when isPaused is false', () => {
        const component = mount(<ReactLottie options={defaultOptions} />);
        const animation = component.instance().anim;

        component.instance().pause();
        expect(animation.isPaused).to.equal(true);

        component.instance().play();
        expect(animation.isPaused).to.equal(false);
        component.unmount();
      });

      it('does not restart an animation paused by prop on unrelated updates', () => {
        const component = mount(
          <ReactLottie options={defaultOptions} isPaused />
        );
        const animation = component.instance().anim;
        expect(animation.isPaused).to.equal(true);

        component.setProps({ width: 300 });
        expect(animation.isPaused).to.equal(true);

        component.setProps({ isPaused: false });
        expect(animation.isPaused).to.equal(false);
        component.unmount();
      });
    });

    describe('frame control', () => {
      it('applies the isSubframe prop on mount and on change', () => {
        const component = mount(
          <ReactLottie options={defaultOptions} isSubframe={false} />
        );
        const animation = component.instance().anim;

        expect(animation.isSubframeEnabled).to.equal(false);

        component.setProps({ isSubframe: true });
        expect(animation.isSubframeEnabled).to.equal(true);
        component.unmount();
      });

      it('moves to an exact frame and honors isSubframe', () => {
        const subframe = mount(<ReactLottie options={defaultOptions} />);
        subframe.instance().goToAndStop(12.7, true);
        expect(subframe.instance().anim.currentFrame).to.equal(12.7);
        expect(subframe.instance().anim.isPaused).to.equal(true);
        subframe.unmount();

        const whole = mount(
          <ReactLottie options={defaultOptions} isSubframe={false} />
        );
        whole.instance().goToAndStop(12.7, true);
        expect(whole.instance().anim.currentFrame).to.equal(12);
        whole.unmount();
      });

      it('delegates goToAndStop and goToAndPlay to lottie-web', () => {        const component = mount(<ReactLottie options={defaultOptions} />);
        const animation = component.instance().anim;
        const stop = sinon.stub(animation, 'goToAndStop');
        const play = sinon.stub(animation, 'goToAndPlay');

        component.instance().goToAndStop(12, true);
        expect(stop.calledOnceWith(12, true)).to.equal(true);

        component.instance().goToAndPlay(1.5);
        expect(play.calledOnceWith(1.5, undefined)).to.equal(true);

        stop.restore();
        play.restore();
        component.unmount();
      });
    });
  });
});

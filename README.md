https://travis-ci.org/Meeshkan/redux-ize.svg?branch=master

# redux-ize

In redux apps, we have actions, we have action creators, but at
[Meeshkan](https://meeshkan.com/), we use Redux Action Creator Creators. Sound
like overkill? Maybe. But let me show how we use it and then you be the judge!

So let’s say that we have an action creator that creates an action and, thanks
to `react-redux`, automatically dispatches it through our middleware when we
invoke it. The middleware can add all sorts of good stuff (timestamps, device
info…), log events, run asynchronous tasks and a whole lot more. Let’s zoom in
on our action creator:

    export default clapForPost(nClaps) => ({
        type: "CLAP_FOR_POST",
        payload: nClaps
    });

Let’s zoom in on our analytics middleware:

    import analytics from 'my-analytics-tool'

    export default store => next => action => {
      if (action.meta && action.meta.analyticsData) {
        analytics(action.type, action.meta.analyticsData)
      }
      next(action);
    }

Hm… in our analytics data, we’d really like to report what page the claps are
coming from. So we go back to our `action.js` file and write a new function:

    export default clapForPostWithAnalytics(nClaps, analytics) => ({
       type: "CLAP_FOR_POST",
       payload: nClaps,
       meta: { analytics },
    });

Do you smell the code smell yet? What if we also want to introduce navigation
data based on where we are in the app? If we have five possible things to add,
hello 2⁵ different functions.

What would be nice is if we could add a bit of analytics data to one action, a
bit of navigation data to another… So let’s do it with `ize`!

    import { ize } from 'redux-ize';

    export const analyticsIze = ize(0)(a => ({
      analytics: a || {},
    }));

    export const promiseIze = ize(2)((resolve, reject) => ({
      form: {
        resolve,
        reject,
      }
    }));

And then in our file with the action creator…

    import { promiseIze, analyticsIze } from './ize';
    import { Ize } from 'redux-ize';
    import { clapForPost } from './actions/self-aggrandizing';

    class MyComponent {
      render() {
        const { clapForPost } = this.props;
        const clapper = () =>
          new Promise((res, rej) => clapForPost(res, rej, 3));
        return (<button onClick={clapper}>Hello world</button>);
      }
    }

    connect(null,
    {
      clapForPost: Ize(
        clapForPost,
        promiseIze(),
        analytics({placeInApp: 'MyComponent'})
      ),
    })(MyComponent);

And the action that will be sent is:

    {
      type: "CLAP_FOR_POST",
      nClaps: 3,
      meta: {
        analytics: {
          placeInApp: 'MyComponent',
        },
        form: {
         resolve: [Function resolve],
         reject: [Function reject],
        },
      },
    }

Voilà our action creator creator! Interestingly, this strategy grew from our
adaptation of a [much-used
hack](https://github.com/redux-saga/redux-saga/issues/161#issuecomment-191312502)
in the `redux-form` world. Action creator creators are a generalization of this
strategy.

At [Meeshkan](https://meeshkan.com/), the rule of thumb has become:

1.  When an action contains information that cannot possibly be linked to the UI,
use middleware.
1.  When an action contains only information that is obviously pertinent to the
action (i.e. e-mail for login), use an action creator.
1.  When you need to dispatch UI-related information or random top-level hacks
without putting them in the action’s payload, the *action creator creator
pattern* is your friend.

Happy hacking!

* [Redux](https://hackernoon.com/tagged/redux?source=post)
* [Redux Action](https://hackernoon.com/tagged/redux-action?source=post)
* [Creator Creators](https://hackernoon.com/tagged/creator-creators?source=post)
* [React Redux](https://hackernoon.com/tagged/react-redux?source=post)
* [Middleware](https://hackernoon.com/tagged/middleware?source=post)

### [Meeshkan](https://hackernoon.com/@meeshkan)

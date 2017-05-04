import { compile } from 'templates-compiler';
import * as forumService from 'forum-service';
import * as toastr from 'toastr';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function getMainPage() {
    let data = {
        sections: [
            {
                title: 'TsarFootball',
                description: 'Forum rules, issue reports, requests, feedback, etc.',
                imageUrl: '/public/assets/logo-page.png',
                link: 'site'
            },
            {
                title: 'Teams',
                description: 'Let your opinion be heard amongst other supporters of your favourite team.',
                imageUrl: '/public/assets/forum-teams.jpg',
                link: 'teams'
            },
            {
                title: 'Premier League Games',
                description: 'Upcoming games, results or just classic games.',
                imageUrl: '/public/assets/forum-games.jpg',
                link: 'games'
            },
            {
                title: 'Media Watch',
                description: 'News, transfers, interviews - discuss or share what you know.',
                imageUrl: '/public/assets/forum-media.jpg',
                link: 'media'
            },
            {
                title: 'Free Zone',
                description: 'Free discussions zone. Whatever doesn\'t fit other sections fits here.',
                imageUrl: '/public/assets/forum-free-zone.jpg',
                link: 'free'
            }
        ]
    };

    compile('forum/main', data)
        .then(html => $mainContainer.html(html));
}

function getCreatePage() {
    compile('forum/create')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnCreateThread = $('#btn-thread-create');

            const $threadCreateTitle = $('#create-thread-title');
            const $threadCreateContent = $('#create-thread-content');
            const $threadCreateImageUrl = $('#create-thread-image-url');
            const $threadCreateTags = $('#create-thread-tags');
            const $threadCreateCategory = $('#create-thread-category');

            const $formThreadCreateTitle = $('#form-create-thread-title');
            const $formThreadCreateContent = $('#form-create-thread-content');
            const $formThreadCreateImageUrl = $('#form-create-thread-image-url');
            const $formThreadCreateTags = $('#form-create-thread-tags');

            $btnCreateThread.on('click', () => {
                if (!$threadCreateTitle.val().trim() || $threadCreateTitle.val().trim().length < 5 || $threadCreateTitle.val().trim().length > 50) {
                    toastr.error('Thread title length must be between 5 and 50 symbols!');
                    $formThreadCreateTitle.addClass('has-error');
                    !$threadCreateTitle.focus();
                    return;
                } else {
                    $formThreadCreateTitle.removeClass('has-error');
                }

                if (!$threadCreateImageUrl.val().trim() || $threadCreateImageUrl.val().trim().length < 5) {
                    toastr.error('Please enter a valid URL!');
                    $formThreadCreateImageUrl.addClass('has-error');
                    !$threadCreateImageUrl.focus();
                    return;
                } else {
                    $formThreadCreateImageUrl.removeClass('has-error');
                }

                if (!$threadCreateTags.val().trim()) {
                    toastr.error('Please enter at least one tag! Helps with searching the threads!');
                    $formThreadCreateTags.addClass('has-error');
                    !$threadCreateTags.focus();
                    return;
                } else {
                    $formThreadCreateTags.removeClass('has-error');
                }

                if (!$threadCreateContent.val().trim()) {
                    toastr.error('Thread content length must be between 5 and 2000 symbols!');
                    $formThreadCreateContent.addClass('has-error');
                    !$threadCreateContent.focus();
                    return;
                } else {
                    $formThreadCreateContent.removeClass('has-error');
                }

                $btnCreateThread.addClass('diasabled');
                $btnCreateThread.attr('diasabled', true);

                let title = $threadCreateTitle.val();
                let content = $threadCreateContent.val();
                let imageUrl = $threadCreateImageUrl.val();
                let tags = $threadCreateTags.val();
                let category = $threadCreateCategory.val();

                forumService.createThread(title, content, imageUrl, category, tags)
                    .then(response => {
                        console.log(response);
                        toastr.success('Thread successfully created!');
                        $(location).attr('href', `#!/forum/${category.toLowerCase()}`);
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured! Check if your data is valid or try again later!');
                        $btnCreateThread.removeClass('diasabled');
                        $btnCreateThread.attr('diasabled', false);
                    });
            });
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

export { getMainPage, getCreatePage };
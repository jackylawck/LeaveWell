/**
 * solace.js - 留愛心安 · 心靈燈塔與生死撫慰終端 (Terminal of Solace & Remembrance)
 * 100% Client-Side Pure JS / 中英雙語溫柔美學 / 撫慰在生者心靈彩蛋模組
 */
(function () {
    'use strict';

    var MONO = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
    var SERIF = '"Noto Serif TC", "Source Han Serif TC", Georgia, serif';

    // 🎨 溫柔心安配色方案 (Gentle & Comforting Palette)
    // 晨曦暖金 (#fde68a / #f59e0b) ‧ 鼠尾草綠 (#a7f3d0 / #34d399) ‧ 柔和天青 (#7dd3fc / #38bdf8) ‧ 深邃夜空灰 (#0f172a / #181d27)
    var S = {
        title: 'background: #0b1120; color: #7dd3fc; font-family: ' + MONO + '; font-size: 13px; font-weight: 700; padding: 8px 14px; border-left: 5px solid #38bdf8; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 4px 4px 0 0; display: block;',
        sub: 'background: #0b1120; color: #a7f3d0; font-family: ' + SERIF + '; font-size: 11.5px; padding: 6px 14px; border-left: 5px solid #34d399; border-bottom: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 0 0 4px 4px; display: block; line-height: 1.6;',
        boxWarm: 'background: #131b2e; color: #f1f5f9; font-family: ' + SERIF + '; font-size: 12px; line-height: 1.85; padding: 14px 18px; border-left: 4px solid #fde68a; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 6px; display: block; white-space: pre-wrap;',
        quote: 'background: #0f172a; color: #cbd5e1; font-family: ' + SERIF + '; font-size: 11.5px; font-style: italic; line-height: 1.8; padding: 12px 16px; border-left: 3px solid #94a3b8; border-radius: 4px; display: block;',
        cliBar: 'background: #0b1120; color: #86efac; font-family: ' + MONO + '; font-size: 11px; font-weight: 600; padding: 7px 14px; border: 1px solid #1e293b; border-left: 5px solid #10b981; border-radius: 4px; display: block;',
        cmdKey: 'background: #1e293b; color: #fde68a; font-weight: 700; font-family: ' + MONO + '; padding: 2px 7px; border-radius: 3px; border: 1px solid #334155;',
        cmdDesc: 'background: transparent; color: #cbd5e1; font-family: ' + MONO + '; padding: 1px 6px;'
    };

    function renderSolaceTerminal() {
        console.log('%c🌿 [ 留愛心安 · 心靈燈塔 // TERMINAL OF SOLACE & PEACE ]', S.title);
        console.log('%c留愛於生，遇事心安 ‧ 當你看到這裡，代表愛從未離開 ‧ 守護在人間延續\nAnchored in Love, Leave Well for Kin ‧ Love never ends, it echoes in order.', S.sub);
        console.log('');

        var introText = [
            '「死亡不是真正的告別，遺忘才是。',
            ' 這座保險庫不是冷冰冰的資產清單，而是一封深思熟慮的情書。',
            ' 當你開啟這個終端，代表那個深愛你的人，已跨越時空為你卸下了最沉重的負擔。',
            ' 請深呼吸，悲傷會如潮水退去，但留在沙灘上的愛與秩序，會一生托住你們的生活。」',
            '',
            '“Death is not the true departure; forgetting is.',
            ' This vault is not a cold inventory of assets, but a deeply considered letter of love.',
            ' Finding this means the one who loved you has already lifted the heaviest burdens across time.',
            ' Take a gentle breath. Grief recedes like waves, but the love and order left behind will shelter you.”'
        ].join('\n');
        console.log('%c' + introText, S.boxWarm);
        console.log('');

        console.log(
            '%c💭「人生的本質不是擁有，而是一場短暫的借用。我們借用了星塵的軀體相遇，終將歸還天地；但相伴的每分每秒，都已銘刻於宇宙的記憶之中。」\n  "Life is not possession, but a brief cosmic loan. We borrowed stardust to meet and love, and though our forms return to the cosmos, the shared moments remain etched into eternity."',
            S.quote
        );
        console.log('');

        console.log('%c💡 心靈撫慰與思念指令 (CLI): 請輸入 solace.help() 查看功能 / Type solace.help() for suite.', S.cliBar);
    }

    var breathTimer = null;
    var breathOverlay = null;

    function removeBreathOverlay() {
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
        }
        if (breathOverlay && breathOverlay.parentNode) {
            breathOverlay.parentNode.removeChild(breathOverlay);
            breathOverlay = null;
        }
    }

    window.solace = Object.freeze({
        help: function () {
            console.log('%c[ 心靈指引指令集 // SOLACE COMMAND SUITE ]', S.sub);
            console.log('%csolace.letter()%c   - 閱讀《致留在人間的你》告白信 / A Letter to Those Who Remain', S.cmdKey, S.cmdDesc);
            console.log('%csolace.comfort()%c  - 撫慰心靈：面對恐懼與離別 / Gentle Guidance for Grief & Healing', S.cmdKey, S.cmdDesc);
            console.log('%csolace.breathe()%c  - 啟動 60 秒「月光深呼吸練習」 / 60s Moonlight Calming Breath', S.cmdKey, S.cmdDesc);
            console.log('%csolace.stars()%c    - 星塵哲思：卡爾·薩根視角的永恆相遇 / Cosmic Solace: We Are Stardust', S.cmdKey, S.cmdDesc);
            console.log('%csolace.audit()%c    - 檢視金庫為你建立的「三道愛的防線」 / The Three Lines of Love & Order', S.cmdKey, S.cmdDesc);
            console.log('%csolace.provenance()%c- 檢索持有人數位簽署與存證認證鏈 / Cryptographic Identity Anchors', S.cmdKey, S.cmdDesc);
            return '請於下方輸入任一指令並按 Enter / Type any command above to proceed.';
        },

        // 💌 致留下來的家人：深情信件（中英雙語）
        letter: function () {
            var letterContent = [
                '【致留在人間的你 // To Those Who Remain】',
                '',
                '親愛的家人：',
                '當你看到這段文字時，代表我可能已經走完了人生的航程，先行離席了。',
                '請不要害怕，也不要陷入自責或長久的慌亂。',
                '',
                '我生前花時間研究加密、一筆筆核對保單、把線索鎖進保險箱，',
                '不是因為我預感死亡有多可怕，而是因為我深愛著你們。',
                '我不想讓你們在最脆弱、眼淚還沒擦乾的時候，',
                '還要孤身一人去翻箱倒櫃、去猜測我的密碼、去面對各家機構繁瑣冰冷的櫃檯。',
                '',
                '這座保險庫，是我在理性與清醒之時，為你們築起的最後一道避風港。',
                '第一層綠色區已列出所有保險公司，你們無需密碼即可直接向官方索償部開檔；',
                '保險箱裡的提示卡，藏著我們共同的溫暖記憶，解鎖後會有專屬顧問全力協助你們。',
                '',
                '請好好吃飯，好好睡覺，代我去看明天的日出與星空。',
                '我已心滿意足，遇事心安。',
                '',
                '------------------------------------------------------------',
                '',
                'Dearest Family,',
                'If you are reading these words, my earthly voyage has come to its peaceful close.',
                'Please do not be afraid, and do not carry regrets or lingering anxiety.',
                '',
                'I spent time organizing cryptography, indexing every policy, and placing clues in our safe,',
                'not out of dread for death, but out of profound love for you.',
                'I refused to leave you in moments of sorrow and tears, wandering blindly through drawer after drawer,',
                'guessing passwords, or facing bureaucratic desks alone.',
                '',
                'This vault is the quiet sanctuary I prepared for you with clarity and foresight.',
                'The Tier 1 green panel lists all insurers—you need no password to file claims directly.',
                'The clue card in our safe holds our shared warm memories, unlocking dedicated contacts to guide you.',
                '',
                'Eat well, rest deeply, and greet tomorrow’s sunshine and starlight on my behalf.',
                'My heart is full and peaceful. Anchored in love, leave well for kin.'
            ].join('\n');

            console.log('%c' + letterContent, S.boxWarm);
            return '🕊️「愛永不止息。」// "Love never fails."';
        },

        // 🌿 面對悲傷與死亡的心理引導（中英雙語）
        comfort: function () {
            var comfortText = [
                '【給此刻正感到悲傷或恐懼的你 // Gentle Guidance for Grief】',
                '',
                '1. 接受脆弱與混亂 (Embrace the Waves of Emotion):',
                '   此時此刻，不論你是想哭泣、感到麻木，還是感到不真實，都是完全正常且健康的。',
                '   允許自己悲傷，一次只做眼前最重要的一件小事即可。',
                '   (Whatever you feel right now—grief, numbness, or disbelief—it is completely natural. Allow yourself space. Handle one small thing at a time.)',
                '',
                '2. 死亡無法抹除真實存在過的美好 (Love Is Indelible):',
                '   那個愛你的人雖然不在身邊，但他對你的愛、你們相視而笑的記憶，',
                '   已經成為你人格與生命的一部分，永遠不會消逝。',
                '   (Physical absence cannot diminish the love, laughter, and memories you shared. They are woven permanently into who you are.)',
                '',
                '3. 你已經做得很好了 (You Are Doing Wonderfully):',
                '   你找到了這份指引，正在有條不紊地處理後續事宜。',
                '   如果在生時有未及說出的感謝或遺憾，請在心中對他說，他一定聽得見。',
                '   (You found this guide and are taking steady steps. Any unsaid words of gratitude or love—speak them in your heart; they are heard.)',
                '',
                '4. 關於死亡的恐懼 (Reframing Death):',
                '   死亡不是深淵，只是生命形式的回歸。在出生前的數十億年裡，我們也曾在那裡安詳沉睡。',
                '   他只是先回到了那個平靜的家園，靜靜守望著你。',
                '   (Death is not a void, but a peaceful return. For billions of years before birth, we rested there serenely. He has simply arrived home ahead, watching over you softly.)'
            ].join('\n');

            console.log('%c' + comfortText, S.boxWarm);
            return '願平靜與勇氣與你同在 // May peace and courage be with you.';
        },

        // 🌌 星塵哲思 (中英雙語)
        stars: function () {
            var stardustText = [
                '「構成我們心臟的鐵、骨骼中的鈣，以及血液中的碳，',
                ' 全部源自數十億年前某顆塌縮超新星的內部熔爐。',
                '',
                ' 我們每一個人，都是宇宙用星塵捏造出的奇蹟。',
                ' 在浩瀚無垠的時空中，我們能夠擁有重疊的歲月、相遇、相愛，',
                ' 這本身就是機率趨近於零的巨大恩賜。',
                '',
                ' 死亡不是生命的湮滅，只是星塵的歸位。',
                ' 當肉身散去，那些原子會回到大地、蒸發入大氣、重新匯入宇宙的洋流。',
                ' 他未曾真正遠去，他存在於你吹過的每一陣微風、看過的每一次落日之中。」',
                '',
                '------------------------------------------------------------',
                '',
                '"The nitrogen in our DNA, the calcium in our teeth, the iron in our blood,',
                ' were made in the interiors of collapsing stars.',
                '',
                ' Every one of us is a miracle sculpted from ancient stardust.',
                ' In the boundless expanse of space and time, that we shared the same era, met, and loved—',
                ' is a gift of unimaginable beauty and grace.',
                '',
                ' Death is not annihilation, but the homecoming of stardust.',
                ' He has not truly left; he lives on in the morning breeze and the twilight skies that embrace you."'
            ].join('\n');

            console.log('%c' + stardustText, S.quote);
            return '🌟「我們都是宇宙借來認識它自己的眼睛。」—— Carl Sagan';
        },

        // 🧘 60 秒「月光舒心呼吸儀」（全螢幕沉靜導引）
        breathe: function () {
            if (breathOverlay) {
                removeBreathOverlay();
                console.log('%c[ 呼吸練習已結束 // Breathing session concluded ]', 'color:#86efac; font-weight:bold;');
                return '已恢復常態 / Restored.';
            }

            console.log('%c[ 啟動月光舒心深呼吸 // MOONLIGHT BOX BREATHING ACTIVE ]', 'background:#0369a1; color:#fff; font-weight:bold; padding:4px 10px; border-radius:3px; font-family:' + MONO);
            console.log('%c請注視螢幕中央的柔和光環，跟隨節奏調節氣息。（點擊畫面任意處或按 ESC 結束）\nFollow the gentle pulsing ring to steady your heart rate. (Click anywhere or press ESC to exit)', S.sub);

            breathOverlay = document.createElement('div');
            breathOverlay.id = 'solace-breath-overlay';
            breathOverlay.style.cssText = [
                'position: fixed',
                'top: 0',
                'left: 0',
                'width: 100vw',
                'height: 100vh',
                'background: rgba(11, 17, 32, 0.88)',
                'backdrop-filter: blur(10px)',
                'z-index: 999999',
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'cursor: pointer',
                'user-select: none'
            ].join(';');

            breathOverlay.innerHTML = [
                '<div style="text-align: center; color: #f8fafc; font-family: ' + SERIF + ';">',
                '  <div id="breath-circle" style="width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, rgba(125,211,252,0.25) 0%, rgba(52,211,153,0.12) 60%, transparent 80%); border: 2px solid #7dd3fc; margin: 0 auto 28px auto; transition: transform 4s ease-in-out, box-shadow 4s ease-in-out; box-shadow: 0 0 30px rgba(125,211,252,0.35); display: flex; flex-direction: column; align-items: center; justify-content: center;">',
                '    <span id="breath-status-zh" style="font-size: 15px; font-weight: bold; color: #7dd3fc; letter-spacing: 1px;">吸氣</span>',
                '    <span id="breath-status-en" style="font-size: 11px; color: #94a3b8; font-family: ' + MONO + '; margin-top: 2px;">Inhale</span>',
                '  </div>',
                '  <h2 style="font-size: 18px; font-weight: normal; letter-spacing: 2px; margin-bottom: 6px; color: #f1f5f9;">安頓呼吸 ‧ 遇事心安</h2>',
                '  <p style="font-size: 11px; color: #94a3b8; font-family: ' + MONO + '; letter-spacing: 1px; margin-bottom: 12px;">Steady Your Breath ‧ Peace Within</p>',
                '  <p id="breath-sub" style="font-size: 13px; color: #cbd5e1; line-height: 1.6; max-width: 380px; margin: 0 auto;">緩慢吸氣... 感受世界正溫柔托住你 (4秒)</p>',
                '  <p id="breath-sub-en" style="font-size: 11px; color: #64748b; font-family: ' + MONO + '; margin-top: 4px;">Gently breathe in... feel supported by the universe (4s)</p>',
                '  <div style="font-size: 10px; color: #64748b; margin-top: 28px;">[ 點擊畫面任意處或按 ESC 結束 ‧ Click anywhere or press ESC to exit ]</div>',
                '</div>'
            ].join('');

            document.body.appendChild(breathOverlay);

            var circle = document.getElementById('breath-circle');
            var statusZh = document.getElementById('breath-status-zh');
            var statusEn = document.getElementById('breath-status-en');
            var subZh = document.getElementById('breath-sub');
            var subEn = document.getElementById('breath-sub-en');

            var cycle = 0; // 0: 吸氣(4s), 1: 屏息(4s), 2: 呼氣(4s), 3: 靜止(4s)
            function updateBreath() {
                cycle = (cycle + 1) % 4;
                if (cycle === 0) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 50px rgba(125,211,252,0.6)';
                    circle.style.borderColor = '#7dd3fc';
                    statusZh.innerText = '吸氣';
                    statusZh.style.color = '#7dd3fc';
                    statusEn.innerText = 'Inhale';
                    subZh.innerText = '緩慢吸氣... 感受新鮮空氣充盈胸膛 (4秒)';
                    subEn.innerText = 'Breathe in slowly... feel life and calm expanding (4s)';
                } else if (cycle === 1) {
                    statusZh.innerText = '屏息';
                    statusZh.style.color = '#fde68a';
                    statusEn.innerText = 'Hold';
                    subZh.innerText = '屏住呼吸... 感受當下的寧靜與安全 (4秒)';
                    subEn.innerText = 'Hold softly... embrace the still sanctuary of now (4s)';
                } else if (cycle === 2) {
                    circle.style.transform = 'scale(0.85)';
                    circle.style.boxShadow = '0 0 20px rgba(52,211,153,0.3)';
                    circle.style.borderColor = '#34d399';
                    statusZh.innerText = '呼氣';
                    statusZh.style.color = '#34d399';
                    statusEn.innerText = 'Exhale';
                    subZh.innerText = '緩慢吐氣... 將心中的慌亂隨氣息釋放 (4秒)';
                    subEn.innerText = 'Breathe out slowly... release the heaviness and sorrow (4s)';
                } else if (cycle === 3) {
                    statusZh.innerText = '平靜';
                    statusZh.style.color = '#94a3b8';
                    statusEn.innerText = 'Rest';
                    subZh.innerText = '安靜停歇... 你的心跳正在找回平穩 (4秒)';
                    subEn.innerText = 'Rest gently... your pulse is finding its rhythm again (4s)';
                }
            }

            setTimeout(function () {
                if (circle) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 50px rgba(125,211,252,0.6)';
                }
            }, 100);

            breathTimer = setInterval(updateBreath, 4000);

            breathOverlay.addEventListener('click', function () {
                removeBreathOverlay();
            });

            function onEsc(e) {
                if (e.key === 'Escape') {
                    removeBreathOverlay();
                    window.removeEventListener('keydown', onEsc);
                }
            }
            window.addEventListener('keydown', onEsc);

            return '月光舒心呼吸練習已啟動 // Breathing session active.';
        },

        // 🛡️ 三道愛的防線審計（中英雙語對齊）
        audit: function () {
            var auditTable = [
                '┌──────────────────────────┬────────────────────────────┬─────────────────────────────┐',
                '│ 愛的防線 (Defense Line)  │ 守護機制 (Mechanism)       │ 實務與心理價值 (Value)      │',
                '├──────────────────────────┼────────────────────────────┼─────────────────────────────┤',
                '│ 1st: 免密公開名冊 (Triage)│ 綠色名冊 (Password-Free)   │ 零障礙：免猜密碼直接開單索償│',
                '│ 2nd: 家庭記憶線索 (Clue) │ 保險箱提示卡 (Memory Hint) │ 零出錯：唯有摯親懂得溫暖拼湊│',
                '│ 3rd: AES-256金庫 (Vault) │ 本地客戶端隔離 (ZDR Core)  │ 零洩露：在生時恪守數碼隱私權│',
                '└──────────────────────────┴────────────────────────────┴─────────────────────────────┘'
            ].join('\n');

            console.log('%c[ 三道愛的防線審計 // THE THREE LINES OF LOVE & ORDER ]', S.sub);
            console.log('%c' + auditTable, 'background: #0b1120; color: #7dd3fc; font-family: ' + MONO + '; font-size: 11px; line-height: 1.5; padding: 6px 12px; border-radius: 4px; display: block; white-space: pre;');
            return '系統狀態：完備無缺。愛與秩序已全面就位 // Status: Green. All lines secured.';
        },

        // 📜 密碼學存證與權威身份認證
        provenance: function () {
            console.log('%c[ CANONICAL PROVENANCE RECORDS // 權威身份與專業存證鏈 ]', S.title);
            console.log('• ORCID iD       : https://orcid.org/0009-0006-0855-0842');
            console.log('• PGP Key ID     : FFA3E47793F1CA32');
            console.log('• PGP Raw Key    : https://keybase.io/jackylawck/pgp_keys.asc');
            console.log('• Keybase Proof  : https://keybase.io/jackylawck');
            console.log('• HKCS W3C ID    : https://hkcs.org.hk/verify/?id=019dd246-6cba-724a-8360-476e1965a1fb');
            console.log('• Mastermind ID  : https://www.credly.com/badges/c6abd067-0cd9-47c5-bcbd-8becd6e86429/public_url');
            console.log('• Oracle GenAI   : https://catalog-education.oracle.com/ords/certview/sharebadge_m?id=E9A6CD33539B3B4476ECF08CDF00F0935F8A39101F74B1C929B7683E4FCF4096');
            return 'Cryptographic identity verified. All anchors validated // 權威身份鏈檢驗通過。';
        }
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(renderSolaceTerminal, 350);
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(renderSolaceTerminal, 350);
        });
    }
})();

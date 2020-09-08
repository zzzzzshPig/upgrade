import $ from '../../src/index'
import { getAjaxRequest } from '../helper'
import { AxiosError } from '../../src/helpers/error'
import { AxiosResponse } from '../../src/types'
import config from '../../src/examples/config'

const axios = $.create({
    baseURL: config.baseUrl + '/test'
})

describe('requests', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should treat single string arg as url', () => {
        axios('/foo')

        return getAjaxRequest().then(request => {
            expect(request.url).toBe(`${config.baseUrl}/test/foo`)
            expect(request.method).toBe('GET')
        })
    })

    test('should treat method value as lowercase string', done => {
        axios({
            url: '/foo',
            method: 'POST'
        }).then(response => {
            expect(response.config.method).toBe('post')
            done()
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200
            })
        })
    })

    test('should reject when request timeout', done => {
        let err: AxiosError

        axios('/foo', {
            timeout: 2000,
            method: 'post'
        }).catch(error => {
            err = error
        })

        getAjaxRequest().then(request => {
            // @ts-ignore
            request.eventBus.trigger('timeout')

            setTimeout(() => {
                expect(err instanceof Error).toBeTruthy()
                expect(err.message).toBe('Timeout of 2000 ms exceeded')
                done()
            }, 100)
        })
    })

    test('should reject when validateStatus returns false', done => {
        const resolveSpy = jest.fn((res: AxiosResponse) => {
            return res
        })

        const rejectSpy = jest.fn((e: AxiosError) => {
            return e
        })

        axios('/foo', {
            validateStatus (status: number) {
                return status !== 500
            }
        })
            .then(resolveSpy)
            .catch(rejectSpy)
            .then(next)

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 500
            })
        })

        function next (reason: AxiosError | AxiosResponse) {
            expect(resolveSpy).not.toHaveBeenCalled()
            expect(rejectSpy).toHaveBeenCalled()
            expect(reason instanceof Error).toBeTruthy()
            expect((reason as AxiosError).message).toBe('Request failed with status code 500')
            expect((reason as AxiosError).response!.status).toBe(500)

            done()
        }
    })

    test('should resolve when validateStatus returns true', done => {
        const resolveSpy = jest.fn((res: AxiosResponse) => {
            return res
        })

        const rejectSpy = jest.fn((e: AxiosError) => {
            return e
        })

        axios('/foo', {
            validateStatus (status: number) {
                return status === 500
            }
        })
            .then(resolveSpy)
            .catch(rejectSpy)
            .then(next)

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 500
            })
        })

        function next (res: AxiosResponse | AxiosError) {
            expect(resolveSpy).toHaveBeenCalled()
            expect(rejectSpy).not.toHaveBeenCalled()
            expect(res.config.url).toBe(`${config.baseUrl}/test/foo`)

            done()
        }
    })

    test('should return JSON when resolved', done => {
        let response: AxiosResponse

        axios('/api/account/signup', {
            auth: {
                username: '',
                password: ''
            },
            method: 'post',
            headers: {
                Accept: 'application/json'
            }
        }).then(res => {
            response = res
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"a": 1}'
            })

            setTimeout(() => {
                expect(response.data).toEqual({ a: 1 })
                done()
            }, 100)
        })
    })

    test('should supply correct response', done => {
        let response: AxiosResponse

        axios.post('/foo').then(res => {
            response = res
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"foo": "bar"}',
                responseHeaders: {
                    'Content-Type': 'application/json'
                }
            })

            setTimeout(() => {
                expect(response.data.foo).toBe('bar')
                expect(response.status).toBe(200)
                expect(response.statusText).toBe('OK')
                expect(response.headers['content-type']).toBe('application/json')
                done()
            }, 100)
        })
    })

    test('should allow overriding Content-Type header case-insensitive', () => {
        let response: AxiosResponse

        axios
            .post(
                '/foo',
                { prop: 'value' },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
            .then(res => {
                response = res
            })

        return getAjaxRequest().then(request => {
            expect(request.requestHeaders['Content-Type']).toBe('application/json')
        })
    })
})

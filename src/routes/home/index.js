import { h, Component } from 'preact';
import ReactTable from 'react-table';
import axios from 'axios';
import TimeAgo from 'timeago-react';
import timeago from 'timeago.js';

timeago.register('tr', require('timeago.js/locales/tr'));


import style from './style';

export default class Home extends Component {
	fetchData() {
		axios
			.get('https://s3.amazonaws.com/karsrail/karsrail.json')
			.then(response => response.data)
			.then(data => {
				if (data.time !== this.state.lastUpdate) {
					this.setState({
						loading: false,
						results: data.results,
						lastUpdate: data.time
					});
				}
			});
	}
	checkUpdates() {
		const { lastUpdate } = this.state;
		if (new Date().getTime() - lastUpdate > 69000) {
			this.fetchData();
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			results: [],
			lastUpdate: null
		};
		this.updateInterval = setInterval(this.fetchData.bind(this), 10000);
	}
	componentDidMount() {
		this.fetchData();
	}
	componentWillUnmount() {
		clearInterval(this.updateInterval);
	}
	render({}, { results, loading, lastUpdate }) {
		if (loading || results.length === 0) {
			return (
				<div class={style.loading}>
					<h1>Güncelleniyor...</h1>
				</div>
			);
		}

		const columns = [
			{
				Header: 'Tarih',
				accessor: 'trDate',
				sortMethod: (a, b) => {
					// @TODO: clear this mess
					const firstDateParts = a.split('/');
					const secondDateParts = b.split('/');
					const d1 = new Date(Number(firstDateParts[2]), Number(firstDateParts[1]) - 1, Number(firstDateParts[0])).getTime();
					const d2 = new Date(Number(secondDateParts[2]), Number(secondDateParts[1]) - 1, Number(secondDateParts[0])).getTime();
					return d1 > d2 ? 1 : -1;
				}
			},
			{
				Header: 'Ankara ➡ Kars',
				accessor: 'ankaraKars',
				Cell: props => props.value > 0 ? props.value : '-'
			},
			{
				Header: 'Kars ➡ Ankara',
				accessor: 'karsAnkara',
				Cell: props => props.value > 0 ? props.value : '-'
			}
		];


		return (
			<div class={style.home}>
				<p class={style.lastUpdate}>Son kontrol <span class={style.timeago}>
					<TimeAgo
						datetime={lastUpdate}
						locale="tr"
					/>
				</span>
				<p style={style.lastUpdate}><span class={style.timeago}>(otomatik güncellenmektedir)</span></p>
				</p>

				<ReactTable
					data={results}
					columns={columns}
					style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}
					defaultSorted={[
						{
							id: 'trDate',
							desc: false
						}
					]}
					showPagination={false}
					multiSort={false}
					defaultPageSize={31}
				/>
			</div>
		);
	}
}
